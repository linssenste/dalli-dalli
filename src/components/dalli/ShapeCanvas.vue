<template>
    <div id="container" class="dalli-area" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { generateTriangles, Triangle, generateRectangles, generateVoronoiDiagram, Rectangle, generateHexagons, Hexagon, VoronoiPoint, Point } from '../../plugins/generator';
import Konva from 'konva';
import { VoronoiCell } from '../../plugins/generator';

interface Shape {
    data: Triangle|Rectangle|Hexagon;
    percentage: number;
    index?: number
}

const totalImageArea=ref<number>(0);
const visiblePercentage=ref<number>(0);

let stage: Konva.Stage;
let layer: Konva.Layer;

const shapes=ref<Shape[]>([]);

const background=new Image();

let imageWidth: number=0;
let imageHeight: number=0;

const emit=defineEmits(['update', 'loaded'])
const props=defineProps<{
    image: string,
    shapes: number, // replaces 'triangles'
    type: 'triangle'|'rectangle'|'hexagon'|'voronoi',
    repeat?: boolean
    manual?: boolean, // prop to trigger manual shape removal
    remove?: boolean // prop to trigger shape removal
}>();



function calculateArea(data: Triangle|Rectangle, type: 'triangle'|'rectangle'|'hexagon'|'voronoi'): number {
    if (type==='triangle') {
        const [v1, v2, v3]=data as Triangle;
        return 0.5*Math.abs(v1.x*(v2.y-v3.y)+v2.x*(v3.y-v1.y)+v3.x*(v1.y-v2.y));
    } else if (type==='hexagon') {
        const { points }=data as Hexagon;
        let area=0;
        for (let i=0; i<points.length; i++) {
            let j=(i+1)%points.length;
            area+=points[i].x*points[j].y;
            area-=points[j].x*points[i].y;
        }
        area/=2;
        return Math.abs(area);
    } else if (type==='voronoi') {
        const points=data as Array<{ x: number; y: number }>;
        let area=0;
        for (let i=0, j=points.length-1; i<points.length; j=i, i++) {
            area+=(points[i].x+points[j].x)*(points[j].y-points[i].y);
        }
        return Math.abs(area/2);
    } else {
        const { width, height }=data as Rectangle;
        return width*height;
    }
}


watch(() => props.remove, removeShape);  // watch the remove prop
watch(() => props.shapes, generateShapes)  // watch the triangles prop
watch(() => props.manual, drawShapes);
watch(() => props.type, generateShapes);
watch(shapes, () => {
    if (shapes.value.length===0&&props.repeat) {
        generateShapes();
        drawShapes()
    }
}, { deep: true })
onMounted(async () => {
    window.addEventListener('resize', handleResize);

    // Initially, no image is loaded
    background.src=props.image;
    background.onload=function () {
        emit('loaded')

        // Get parent dimensions
        const parent=document.getElementById('container');
        const parentWidth=parent? parent.offsetWidth:0;

        // Calculate the image's aspect ratio
        const imageAspectRatio=background.width/background.height;

        // Initialize canvas dimensions to image dimensions
        let canvasHeight=parentWidth/imageAspectRatio;

        // Create Konva stage
        stage=new Konva.Stage({
            container: 'container',
            width: parentWidth,
            height: canvasHeight
        });

        // Create layer
        layer=new Konva.Layer();
        stage.add(layer);

        imageWidth=parentWidth;
        imageHeight=canvasHeight;

        totalImageArea.value=imageWidth*imageHeight; // calculate total image area
        visiblePercentage.value=0; // reset the visible percentage to 0

        generateShapes();
    }
});


function handleResize() {
    // Get parent dimensions
    const parent=document.getElementById('container');
    const parentWidth=parent? parent.offsetWidth:0;

    // Calculate the image's aspect ratio
    const imageAspectRatio=background.width/background.height;

    // Initialize canvas dimensions to image dimensions
    let canvasHeight=parentWidth/imageAspectRatio;

    // Update the stage dimensions
    stage.width(parentWidth);
    stage.height(canvasHeight);

    imageWidth=parentWidth;
    imageHeight=canvasHeight;

    totalImageArea.value=imageWidth*imageHeight; // update total image area

    drawShapes(); // redraw shapes on resize
}

onUnmounted(() => {
    // Remove event listener when component is unmounted
    window.removeEventListener('resize', handleResize);
});


function generateShapes() {

    if (!stage||!layer) return;


    shapes.value=[]; // clear current shapes

    let data=[];

    if (props.type==='triangle') {
        data=generateTriangles(stage.width(), stage.height(), props.shapes);
    }
    else if (props.type==='hexagon') {
        data=generateHexagons(stage.width(), stage.height(), props.shapes);
    } else if (props.type==='voronoi') {
        data=generateVoronoiDiagram(stage.width(), stage.height(), props.shapes);
    } else {
        data=generateRectangles(stage.width(), stage.height(), props.shapes);
    }

    data=data.sort(() => 0.5-Math.random());

    data.forEach(item => {
        shapes.value.push({ data: item } as Shape);
    });

    shapes.value.forEach(shape => {
        const area=calculateArea(shape.data, props.type);  // calculate area for each shape
        shape.percentage=area/totalImageArea.value*100;  // calculate the area of the shape as a percentage of the total image area
    });

    drawShapes();


}

function drawShapes() {
    if (!stage||!layer) return;

    layer.clear();  // Clear the layer

    // Create an image with the background
    const backgroundImage=new Konva.Image({
        image: background,
        width: stage.width(),
        height: stage.height(),
    });

    // Add the background image to the layer
    layer.add(backgroundImage);

    // Calculate the scale based on original image size and current stage size
    const scaleX=stage.width()/imageWidth;
    const scaleY=stage.height()/imageHeight;

    shapes.value.forEach(({ data }, index) => {
        let polygon=null;
        if (props.type==='hexagon') {
            polygon=new Konva.Line({
                points: (data as Hexagon).points.flatMap((p: Point) => [p.x*scaleX, p.y*scaleY]),
                fill: '#F0F0F0',
                stroke: '#E0E0E0',
                strokeWidth: 1,
                closed: true,
            });
            // rest of the code to handle 'mouseover', 'mouseout', 'click' events and adding polygon to layer
        } else if (props.type==='voronoi') {
            polygon=new Konva.Line({
                points: (data as VoronoiCell).flatMap((p: VoronoiPoint) => [p.x*scaleX, p.y*scaleY]),
                fill: '#F0F0F0',
                stroke: '#E0E0E0',
                strokeWidth: 1,
                closed: true,
            });
        } else if (props.type==='triangle') {
            polygon=new Konva.Line({
                points: data.flatMap((v: any) => [v.x*scaleX, v.y*scaleY]),
                fill: '#F0F0F0',
                stroke: '#E0E0E0',
                strokeWidth: 1,
                closed: true,
            });

        } else {
            // create a new Konva.Rect for each rectangle
            const { x, y, width, height }=data as Rectangle;
            polygon=new Konva.Rect({
                x: x*scaleX,
                y: y*scaleY,
                width: width*scaleX,
                height: height*scaleY,
                fill: '#F0F0F0',
                stroke: '#E0E0E0',
                strokeWidth: 1,
            });

        }


        polygon.index=index;


        polygon.on('mouseover', function (this: Konva.Line) {
            if (props.manual!=true) return

            this.fill('#E0E0E0');
            layer.draw();
        });


        polygon.on('click', function (this: Konva.Line) {
            if (props.manual!==true) return;

            this.remove();
            layer.draw();

        });
        polygon.on('mouseout', function (this: Konva.Line) {
            if (props.manual!=true) return

            this.fill('#F0F0F0');
            layer.draw();
        });

        layer.add(polygon);
    });

    layer.draw();
}


function removeShape() {
    if (layer.children.length>0) {
        // destroy shape & redraw layer
        layer.children[layer.children.length-1].destroy();
        layer.draw();
    }
}







</script>


<style scoped>
.dalli-area {
    position: relative;


}
</style>