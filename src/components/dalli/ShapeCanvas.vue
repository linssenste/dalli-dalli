<template>
	<div id="container" class="dalli-area" />
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { generateTriangles, Triangle, generateRectangles, generateVoronoiDiagram, Rectangle, generateHexagons, Hexagon, VoronoiPoint, Point } from '../../plugins/generator';
import Konva from 'konva';
import { VoronoiCell } from '../../plugins/generator';

interface Shape {
	data: Triangle | Rectangle | Hexagon;
	percentage: number;
	index?: number
}

const totalImageArea = ref<number>(0);
const visiblePercentage = ref<number>(0);

let stage: Konva.Stage;
let layer: Konva.Layer;

const shapes = ref<Shape[]>([]);

const background = new Image();

let imageWidth: number = 0;
let imageHeight: number = 0;

const emit = defineEmits(['update', 'loaded'])
const props = defineProps<{
	image: string,
	shapes: number | string, // replaces 'triangles'
	type: 'triangle' | 'rectangle' | 'hexagon' | 'voronoi',
	repeat?: boolean
	manual?: boolean, // prop to trigger manual shape removal
	remove?: boolean // prop to trigger shape removal
}>();



function calculateArea(data: Triangle | Rectangle, type: 'triangle' | 'rectangle' | 'hexagon' | 'voronoi'): number {
	if (type === 'triangle') {
		const [v1, v2, v3] = data as Triangle;
		return 0.5 * Math.abs(v1.x * (v2.y - v3.y) + v2.x * (v3.y - v1.y) + v3.x * (v1.y - v2.y));
	} else if (type === 'hexagon') {
		const { points } = data as Hexagon;
		let area = 0;
		for (let i = 0; i < points.length; i++) {
			let j = (i + 1) % points.length;
			area += points[i].x * points[j].y;
			area -= points[j].x * points[i].y;
		}
		area /= 2;
		return Math.abs(area);
	} else if (type === 'voronoi') {
		const points = data as Array<{ x: number; y: number }>;
		let area = 0;
		for (let i = 0, j = points.length - 1; i < points.length; j = i, i++) {
			area += (points[i].x + points[j].x) * (points[j].y - points[i].y);
		}
		return Math.abs(area / 2);
	} else {
		const { width, height } = data as Rectangle;
		return width * height;
	}
}


watch(() => props.remove, removeShape);  // watch the remove prop
watch(() => props.shapes, generateShapes)  // watch the triangles prop
watch(() => props.manual, drawShapes);
watch(() => props.type, generateShapes);
watch(visiblePercentage, () => {

	if (!props.repeat) emit('update', visiblePercentage.value)

})
function handleKeyboard(e: KeyboardEvent): void {
	if (totalImageArea.value === 0) return;
	if (e.code == 'Space' && props.manual == true) removeShape();
}
onMounted(async () => {

	window.addEventListener('resize', handleResize);

	// Initially, no image is loaded
	background.src = props.image;
	background.onload = function () {

		emit('loaded')

		// Get parent dimensions
		const parent = document.getElementById('container');
		const parentWidth = parent ? parent.offsetWidth : 0;
		const parentHeight = parent ? parent.offsetHeight : 0;

		// Calculate the image's aspect ratio
		const imageAspectRatio = background.width / background.height;

		// Initialize canvas dimensions to image dimensions
		let canvasHeight = parentHeight

		let canvasWidth = parentWidth;
		if (background.height < background.width) {
			canvasHeight = parentWidth / imageAspectRatio;
		} else {
			canvasWidth = parentHeight * imageAspectRatio
		}
		// Create Konva stage
		stage = new Konva.Stage({
			container: 'container',
			width: canvasWidth,
			height: canvasHeight
		});

		// Create layer
		layer = new Konva.Layer();
		stage.add(layer);

		imageWidth = canvasWidth;
		imageHeight = canvasHeight;

		totalImageArea.value = imageWidth * imageHeight; // calculate total image area
		visiblePercentage.value = 0; // reset the visible percentage to 0

		generateShapes();

		window.addEventListener('keydown', handleKeyboard)
	}



});


function handleResize() {
	if (!stage || !layer) return;
	// Get parent dimensions
	const parent = document.getElementById('container');
	const parentWidth = parent ? parent.offsetWidth : 0;
	const parentHeight = parent ? parent.offsetHeight : 0;

	// Calculate the image's aspect ratio
	const imageAspectRatio = background.width / background.height;

	// Initialize canvas dimensions to image dimensions
	let canvasHeight = parentHeight

	let canvasWidth = parentWidth;
	if (background.height < background.width) {
		canvasHeight = parentWidth / imageAspectRatio;
	} else {
		canvasWidth = parentHeight * imageAspectRatio
	}

	// Update the stage dimensions
	stage.width(canvasWidth);
	stage.height(canvasHeight);

	imageWidth = canvasWidth;
	imageHeight = canvasHeight;

	totalImageArea.value = imageWidth * imageHeight; // update total image area

	drawShapes(); // redraw shapes on resize
}

onUnmounted(() => {
	// Remove event listener when component is unmounted
	window.removeEventListener('resize', handleResize);
	window.removeEventListener('keydown', handleKeyboard)

});


function generateShapes() {

	if (!stage || !layer) return;

	shapes.value = []; // clear current shapes

	let data = [];

	if (props.type === 'triangle') {
		data = generateTriangles(stage.width(), stage.height(), props.shapes);
	}
	else if (props.type === 'hexagon') {
		data = generateHexagons(stage.width(), stage.height(), props.shapes);
	} else if (props.type === 'voronoi') {
		data = generateVoronoiDiagram(stage.width(), stage.height(), props.shapes);
	} else {
		data = generateRectangles(stage.width(), stage.height(), props.shapes);
	}

	data = data.sort(() => 0.5 - Math.random());

	data.forEach(item => {
		shapes.value.push({ data: item } as Shape);
	});

	shapes.value.forEach(shape => {
		const area = calculateArea(shape.data, props.type);  // calculate area for each shape
		shape.percentage = area / totalImageArea.value * 100;  // calculate the area of the shape as a percentage of the total image area
	});

	let sumOfPercentages = shapes.value.reduce((sum, shape) => sum + shape.percentage, 0);

	shapes.value.forEach(shape => {
		shape.percentage = shape.percentage / sumOfPercentages * 100;
	});

	visiblePercentage.value = 0;


	drawShapes();


}

function drawShapes() {
	if (!stage || !layer) return;

	layer.clear();  // Clear the layer

	// Create an image with the background
	const backgroundImage = new Konva.Image({
		image: background,
		width: stage.width(),
		height: stage.height(),
	});

	// Add the background image to the layer
	layer.add(backgroundImage);

	// Calculate the scale based on original image size and current stage size
	const scaleX = stage.width() / imageWidth;
	const scaleY = stage.height() / imageHeight;

	shapes.value.forEach(({ data, percentage }, index) => {
		let polygon = null;
		if (props.type === 'hexagon') {
			polygon = new Konva.Line({
				points: (data as Hexagon).points.flatMap((p: Point) => [p.x * scaleX, p.y * scaleY]),
				fill: '#F0F0F0',
				stroke: '#c0c0c0',
				strokeWidth: 1,
				closed: true,
			});
			// rest of the code to handle 'mouseover', 'mouseout', 'click' events and adding polygon to layer
		} else if (props.type === 'voronoi') {
			polygon = new Konva.Line({
				points: (data as VoronoiCell).flatMap((p: VoronoiPoint) => [p.x * scaleX, p.y * scaleY]),
				fill: '#F0F0F0',
				stroke: '#c0c0c0',
				strokeWidth: 1,
				closed: true,
			});
		} else if (props.type === 'triangle') {
			polygon = new Konva.Line({
				points: data.flatMap((v: any) => [v.x * scaleX, v.y * scaleY]),
				fill: '#F0F0F0',
				stroke: '#E0E0E0',
				strokeWidth: 1,
				closed: true,
			});

		} else {
			// create a new Konva.Rect for each rectangle
			const { x, y, width, height } = data as Rectangle;
			polygon = new Konva.Rect({
				x: x * scaleX,
				y: y * scaleY,
				width: width * scaleX,
				height: height * scaleY,
				fill: '#F0F0F0',
				stroke: '#E0E0E0',
				strokeWidth: 1,
			});

		}


		polygon.index = index;
		polygon.percentage = percentage

		polygon.on('mouseover', function (this: Konva.Line) {
			if (props.manual != true) return
			document.body.style.cursor = "pointer"

			this.fill('#c0c0c0');
			layer.draw();
		});

		polygon.on('tap', function (this: any) {
			if (props.manual !== true) return;

			visiblePercentage.value += this.percentage;
			if (visiblePercentage.value >= 100) {
				visiblePercentage.value = 100;
			}

			// Remove the shape from the shapes array
			shapes.value.splice(this.index, 1);

			if (layer.children.length < 2 && props.repeat == true) {
				generateShapes();
				drawShapes()
			}

			this.remove();
			layer.draw();
		});

		polygon.on('click', function (this: any) {
			if (props.manual !== true) return;

			visiblePercentage.value += this.percentage;
			if (visiblePercentage.value >= 100) {
				visiblePercentage.value = 100;
			}

			// Remove the shape from the shapes array
			shapes.value.splice(this.index, 1);

			if (layer.children.length < 2 && props.repeat == true) {
				generateShapes();
				drawShapes()
			}

			this.remove();
			layer.draw();
		});

		polygon.on('mouseout', function (this: Konva.Line) {
			if (props.manual != true) return

			document.body.style.cursor = "default"
			this.fill('#F0F0F0');
			layer.draw();
		});

		layer.add(polygon);
	});

	layer.draw();
}

function removeShape() {

	if (layer.children.length > 1) {

		if (!props.repeat) visiblePercentage.value += layer.children[layer.children.length - 1].percentage;

		// destroy shape & redraw layer
		layer.children[layer.children.length - 1].destroy();

		layer.draw();
	} else {

		if (props.repeat == true) {

			generateShapes();
			drawShapes()

		}
	}
}

</script>


<style scoped>
.dalli-area {
	position: relative;

	display: flex;
	align-items: center;
	justify-content: center;
	border: none !important;

}
</style>