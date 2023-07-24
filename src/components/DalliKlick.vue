<template>
    <div style="position: relative; width: 100%; height: 100%; overflow: hidden; user-select: none; background-color: #F0F0F0;"
        :style="!hasInterval? 'cursor: pointer':''" v-on:click="removeShape(true)">

        <div v-if="shapes.length>0&&!preview&&visiblePercentage>0.00" class="control-area">

            <span>{{visiblePercentage.toFixed(2)}}
                %</span>

            <div style="display: flex; flex-direction: row; align-items: center;">
                <span v-if="isPaused&&hasInterval"
                    style="color: #A0A0A0; font-size: 14px; text-transform: uppercase; letter-spacing: .5px;">Press Space to
                    continue</span>
                <i v-if="hasInterval" class="pause-button" :style="isPaused? 'color: #BB2D1B':''" @click="toggleTimer"
                    :class="`fa-solid fa-circle-${!isPaused? 'pause':'play'}`" />
                <span v-else style="color: #A0A0A0; font-size: 14px; text-transform: uppercase; letter-spacing: .5px;">
                    Click anywhere to remove Triangle

                </span>


            </div>

        </div>



        <div
            style="position: relative; ; position: absolute; top: calc(50% + 25px); left: 50%; transform: translate(-50%, -50%); width: 100%; ">
            <canvas style="border: none; margin: auto; display: block;" ref="canvasRef"></canvas>

            <div v-if="visiblePercentage==0&&!preview&&store.state.settings.interval==false"
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #A0A0A0; font-size: 14px; text-transform: uppercase; letter-spacing: .5px;">
                Click anywhere or Press Space to
                start</div>

        </div>



    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick, computed } from 'vue';
import Delaunator from 'delaunator';
import { store } from '../store';


type Point=[number, number];
type Triangle=Array<{ x: number, y: number }>;


const totalImageArea=ref<number>(0);  // New: Store the total image area
const visiblePercentage=ref<number>(0);  // New: The visible percentage of the image


const canvasRef=ref<HTMLCanvasElement|null>(null);

const shapes=ref<Array<{ vertices: Triangle, percentage: number }>[]>([]);
let context: CanvasRenderingContext2D|null=null;
const background=new Image();

let imageWidth: number=0;
let imageHeight: number=0;
const emit=defineEmits(['update', 'loaded'])
const props=defineProps<{
    image: string,
    preview?: boolean
}>();
props.preview

function calculateArea(vertices: Triangle): number {
    const [v1, v2, v3]=vertices;
    return 0.5*Math.abs(v1.x*(v2.y-v3.y)+v2.x*(v3.y-v1.y)+v3.x*(v1.y-v2.y));
}


onMounted(async () => {


    await nextTick()
    const canvas=canvasRef.value;

    if (!canvas) return;
    context=canvas.getContext('2d');

    // Initially, no image is loaded
    background.src=props.image;
    background.onload=function () {
        emit('loaded')
        // Get window dimensions
        const windowWidth=window.innerWidth-100; // Subtract 20 to account for a 10px margin on both sides
        const windowHeight=window.innerHeight-100; // Subtract 20 to account for a 10px margin on both sides

        // Calculate the image's aspect ratio
        const imageAspectRatio=background.width/background.height;

        // Initialize canvas dimensions to image dimensions
        let canvasWidth=background.width;
        let canvasHeight=background.height;

        // If the image's width exceeds the window's width, scale both down proportionally
        if (background.width>windowWidth) {
            canvasWidth=windowWidth;
            canvasHeight=windowWidth/imageAspectRatio;
        }

        // If the image's height exceeds the window's height (after potential rescaling), scale both down proportionally
        if (canvasHeight>windowHeight) {
            canvasHeight=windowHeight;
            canvasWidth=windowHeight*imageAspectRatio;
        }

        // Set the canvas size to the calculated dimensions
        canvas.width=canvasWidth;
        canvas.height=canvasHeight;

        imageWidth=canvasWidth;
        imageHeight=canvasHeight;

        totalImageArea.value=imageWidth*imageHeight; // calculate total image area
        visiblePercentage.value=0; // reset the visible percentage to 0


        generateShapes();
    }

    startGame()
    window.addEventListener('keydown', pauseKeyboardEvent)

    // Attach resize event listener to update the canvas size when window is resized
    window.addEventListener('resize', resizeCanvas);
});
onBeforeUnmount(() => {
    // Clean up event listener
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('keydown', pauseKeyboardEvent)


});


function pauseKeyboardEvent(e: KeyboardEvent): void {

    if (e.code==='Space') {
        if (!hasInterval.value) removeShape(true)
        else toggleTimer();
    }

}

const isPaused=ref(false)
function toggleTimer(): void {

    isPaused.value=!isPaused.value;
}

const autoTimer=ref<any>(null);


const hasInterval=computed(() => store.state.settings.interval)


function startGame(): void {


    isPaused.value=false;

    visiblePercentage.value=0; // reset the visible percentage to 0


    if (props.preview!=true&&!hasInterval.value) return;


    if (autoTimer.value!=null) clearInterval(autoTimer.value);

    removeShape()
    autoTimer.value=setInterval(() => {
        removeShape()
    }, props.preview===true? 50:store.state.settings.time)



}





// Method to handle window resize
function resizeCanvas() {
    if (canvasRef.value&&context) {
        const margin=50; // Margin on both sides
        const ratio=imageWidth/imageHeight;
        let newWidth=window.innerWidth-margin;
        let newHeight=window.innerHeight-margin;

        // If the new width doesn't fit the ratio, adjust it
        if (newWidth/newHeight>ratio) {
            newWidth=newHeight*ratio;
        } else { // If the new height doesn't fit the ratio, adjust it
            newHeight=newWidth/ratio;
        }

        // Set the new dimensions of the canvas
        canvasRef.value.width=newWidth;
        canvasRef.value.height=newHeight;

        // Redraw shapes with the new canvas size
        drawShapes();
    }
}



function generateShapes() {
    const canvas=canvasRef.value;
    if (!canvas||!context) return;

    shapes.value=[]; // clear current shapes

    // generateTriangles is now responsible for creating all the triangles
    let triangles=generateTriangles(canvas.width, canvas.height, store.state.settings.triangles);

    triangles.forEach(triangle => {
        shapes.value.push({ vertices: triangle });
    });

    shapes.value.forEach(shape => {
        const area=calculateArea(shape.vertices);  // calculate area for each shape
        shape.percentage=area/totalImageArea.value*100;  // calculate the area of the shape as a percentage of the total image area
    });
    drawShapes();

    // startGame()
}

function generateTriangles(width: number, height: number, numPoints: number): Triangle[] {
    let points: Point[]=[];

    // Generate random points for the triangles.
    for (let i=0; i<numPoints; i++) {
        points.push([
            Math.random()*width, // x-coordinate
            Math.random()*height  // y-coordinate
        ]);
    }

    // Add the corners of the canvas to the points list.
    points.push([0, 0], [0, height], [width, 0], [width, height]);

    // Use the Delaunator library to generate a Delaunay triangulation.
    let delaunay=Delaunator.from(points);
    let triangles=delaunay.triangles;

    // Format the triangles array.
    let formattedTriangles: Triangle[]=[];
    for (let i=0; i<triangles.length; i+=3) {
        formattedTriangles.push([
            { x: points[triangles[i]][0], y: points[triangles[i]][1] },
            { x: points[triangles[i+1]][0], y: points[triangles[i+1]][1] },
            { x: points[triangles[i+2]][0], y: points[triangles[i+2]][1] }
        ]);
    }

    return formattedTriangles;
}

function drawShapes() {
    if (!context||!canvasRef.value) return;
    context.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
    context.drawImage(background, 0, 0, canvasRef.value.width, canvasRef.value.height);

    // Calculate the scale based on original image size and current canvas size
    const scaleX=canvasRef.value.width/imageWidth;
    const scaleY=canvasRef.value.height/imageHeight;

    shapes.value.forEach(({ vertices }) => {
        context!.beginPath();
        vertices.forEach((v, i) => {
            // Scale the position of each vertex
            const x=v.x*scaleX;
            const y=v.y*scaleY;
            if (i===0) context!.moveTo(x, y);
            else context!.lineTo(x, y);
        });
        context!.closePath();
        context!.fillStyle='#F0F0F0';
        context!.fill();
        context!.strokeStyle='#F0F0F0';
        context!.lineWidth=2
        context!.stroke();
    });
}
function removeShape(manual=false) {
    if (props.preview!=true&&manual==true&&hasInterval.value==true) return;
    if (shapes.value.length>0&&!isPaused.value) {
        const randomIndex=Math.floor(Math.random()*shapes.value.length);

        const removedShape=shapes.value[randomIndex];  // save the removed shape

        shapes.value.splice(randomIndex, 1);

        visiblePercentage.value+=removedShape.percentage;  // use the removed shape's percentage to update visiblePercentage

        emit('update', visiblePercentage.value)
        if (shapes.value.length===0) {
            visiblePercentage.value=100;


            if (props.preview===true) {
                generateShapes();
                startGame()
            }
        }

        drawShapes();
    }
}

</script>

<style scoped>
canvas {
    max-width: 100%;
    max-height: 100%;
    background-color: #F0F0F0;
    border: 0px solid black;

}

.pause-button {
    margin-left: 20px;
    font-size: 40px;
    border-radius: 20px;
    color: black;
    transition: all 100ms ease-in-out;
    cursor: pointer;
}

.pause-button:hover {
    color: #BB2D1B;
    transition: all 100ms ease-in-out;
}




.control-area {
    position: absolute;
    top: 0px;
    width: calc(100% - 40px);
    padding-left: 20px;
    padding-right: 20px;
    height: 75px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.control-area span {
    font-size: 18px;
    font-weight: 700;
}
</style>
