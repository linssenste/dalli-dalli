<template>
	<div class="canvas-container">
		<div id="honeycomb" v-if="setupMode" />
		<div v-if="setupMode" class="settings-container">
			<div class="settings-card">


				<a href="/">
				<img height="80" class="game-logo" src="../assets/game-logo.webp" />
				</a>

				

				<ShapeSettings style="width: 100%;" v-on:update="settings = $event" />

				<div style="display: flex; flex-direction: row; align-items: center; width: 100%;gap: 15px">

					<!-- Input for image upload -->
					<input hidden id="attach-image" type="file" @change="handleFileUpload" accept="image/*" />
					<button v-on:click="uploadImageClick()" class="icon-button upload-button"><i
						   v-if="uploadedImage == null" class="fa-solid fa-upload" /><i v-else class="fa-solid fa-image"
						   style="color: #BB2D1B" /></button>
					<input v-model="link" v-on:blur="invalidUrl = false"
						   :class="uploadedImage != null ? 'url-input-disabled' : ''" class="url-input"
						   placeholder="Add image by link" />


				</div>

				<span v-if="invalidUrl && link.length > 0">Invalid image link</span>
			
				
				<!-- start image viewer -->
				<button class="start-button action-button" :class="(!isValidUrl && !uploadedImage) ? 'button-disabled' : ''"
						@click="showImage()">
					<i class="fa-solid fa-play "></i>
					<div>Show Image</div>
				</button>

			</div>
		</div>

		<div v-else class="shape-canvas">

			<!-- close button / go back to settings -->
			<button class="icon-button close-button" v-on:click="setupMode = true"><i class="fa-solid fa-xmark" /></button>

			<div v-if="settings.interval != 0" class="timer-pause-row">

				<!-- timer progress bar -->
				<TimerProgress :pause="pauseToggle" :overlay="true" :preview="true" data-testid="image-timer"
							   v-on:update="toggleShapeReveal = !toggleShapeReveal" :interval="settings.interval"
							   class="progress-timer" />

				<!-- pause button -->
				<button v-on:click="pauseToggle = !pauseToggle" class="icon-button"><i
					   :class="`fa-solid fa-${!pauseToggle ? 'pause' : 'play'}`" />

				</button>
			</div>


			<ShapeCanvas :shapes="settings.shapes" :manual="settings.interval == 0" :remove="toggleShapeReveal"
						 :type="settings.type" :image="uploadedImage ?? link" :preview="false"
						 class="image-canvas"/>

		</div>
	</div>
</template>
  
<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import ShapeSettings from '../components/settings/ShapeSettings.vue';
import ShapeCanvas from '../components/dalli/ShapeCanvas.vue';
import TimerProgress from '../components/dalli/TimerProgress.vue';

const settings = ref({
	interval: parseInt(((new URL(document.location as any)).searchParams).get('interval') ?? '0'),
	shapes: parseInt(((new URL(document.location as any)).searchParams).get('shapes') ?? '20'),
	type: (((new URL(document.location as any)).searchParams).get('type') ?? 'voronoi') as ('triangle'|'rectangle'|'hexagon'|'voronoi')
});
const pauseToggle = ref(false)
const setupMode = ref(true);
const link = ref((((new URL(document.location as any)).searchParams).get('image') ?? ''));
const uploadedImage: any | null = ref(null)
const isValidUrl = computed(() => {
	var urlPattern = new RegExp(
		'^(https?:\\/\\/)?' +
		'((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
		'((\\d{1,3}\\.){3}\\d{1,3}))' +
		'(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
		'(\\?[;&a-z\\d%_.~+=-]*)?' +
		'(\\#[-a-z\\d_]*)?$',
		'i'
	);
	return !!urlPattern.test(link.value);
});

onMounted(() => {
	document.title = "Dalli-Dalli Viewer"

	// if (link.value == null || link.value.length == 0) setupMode.value = true;
	// else setupMode.value = false;


	window.addEventListener("beforeunload", (event) => {
		if (uploadedImage.value != null) event.returnValue = true;
	});
});

watch(link, () => {
	if (link.value.length > 0 && isValidUrl) uploadedImage.value = null
})
watch(setupMode, () => {
	window.addEventListener('keydown', handleKeyboard)
})

function uploadImageClick(): void {
	const doc = document.getElementById("attach-image")
	if (doc) doc.click()
}

function handleKeyboard(e: KeyboardEvent): void {

	if (!setupMode.value && e.code == 'Space') pauseToggle.value = !pauseToggle.value
}

const invalidUrl = ref(false)
async function showImage() {
	let here = new URL(window.location.href);

	if (uploadedImage.value == null) {

		try {
			await testImage(link.value, 1000);

			here.searchParams.set('image', link.value);
		} catch (error) {
			invalidUrl.value = true;
			return;
		}


	}

	else here.searchParams.delete("image")



	// Add or update query parameters
	here.searchParams.set('interval', String(settings.value.interval));
	here.searchParams.set('shapes', String(settings.value.shapes));
	here.searchParams.set('type', settings.value.type);


	// Update the URL without triggering a page reload
	history.pushState({}, '', here.href);

	setupMode.value = false;


}

function testImage(url: string, timeoutT: number) {
	return new Promise(function (resolve, reject) {
		var timeout = timeoutT || 5000;
		var timer: string | number | NodeJS.Timeout | undefined, img = new Image();
		img.onerror = img.onabort = function () {
			clearTimeout(timer);
			reject("error");
		};
		img.onload = function () {
			clearTimeout(timer);
			resolve("success");
		};
		timer = setTimeout(function () {
			// reset .src to invalid URL so it stops previous
			// loading, but doesn't trigger new load
			img.src = "//!!!!/test.jpg";
			reject("timeout");
		}, timeout);
		img.src = url;
	});
}


const toggleShapeReveal = ref(false)




// Handle file upload
function handleFileUpload(event: any): void {
	const file = event.target.files[0];
	if (file) {
		// Assuming you want to convert the uploaded image to a data URL
		const reader = new FileReader();
		reader.onload = (e) => {
			uploadedImage.value = e.target?.result as string;
			link.value = "";
		};
		reader.readAsDataURL(file);
	}
}
</script>
  
<style scoped>
.upload-button {
	-webkit-box-shadow: none !important;

	box-shadow: none !important;

}

.icon-button {
	-webkit-box-shadow: 1px 1px 15px -4px rgba(0, 0, 0, 0.3);
	box-shadow: 1px 1px 15px -4px rgba(0, 0, 0, 0.3);
}


.icon-button:hover i {
	color: #BB2D1B
}


.icon-button i {
	transition: all 150ms ease-in-out;
}

.url-input {
	height: 40px;
	border: none;
	outline: none;
	background-color: #f0f0f0;

	border-radius: 5px;
	padding-left: 10px;
	width: calc(100% - 40px);
	font-size: 15px;
	transition: all 150ms ease-in-out;
}

.url-input:hover {
	opacity: 1;
	background-color: #eaeaea;
}

.url-input-disabled {
	opacity: .5;
}

.start-button {
	width: 100%;
	margin-top: 30px !important;
}


.canvas-container {
	position: fixed;
	width: 100%;
	height: 100%;

}



.settings-container {
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;

	width: 100%;
	backdrop-filter: blur(10px);
	/* Adjust the blur radius as needed */
	-webkit-backdrop-filter: blur(10px);
	height: 100%
}

.settings-card {
	display: flex;
	flex-direction: column;
	align-items: center;

	width: 450px;
	max-height: calc(100% - 100px);
	overflow: auto;
	position: relative;
	background-color: #ffffffcc;
	padding: 20px;
	border-radius: 10px;
	backdrop-filter: blur(10px);
	/* Adjust the blur radius as needed */
	-webkit-backdrop-filter: blur(10px);
}


.game-logo {
	margin-bottom: 5px;
}

#honeycomb {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: center url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(187, 45, 27, 1)' viewBox='0 0 100 169.5'%3E%3Cpolygon points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'%3E%3C/polygon%3E%3Cpolygon points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'%3E%3C/polygon%3E%3Cpolygon points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'%3E%3C/polygon%3E%3Cpolygon points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'%3E%3C/polygon%3E%3Cpolygon points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'%3E%3C/polygon%3E%3C/svg%3E");
	background-size: 60px;
	opacity: .2;
	animation: slide 5s linear infinite;
}


@keyframes slide {
	0% {
		background-position: 0 0;
	}

	100% {
		background-position: -60px 0;
	}
}


.shape-canvas {
	background-color: #F0F0F0;
	width: 100%;
	height: 100%;

}
.image-canvas {
	width: 100%; height: 100%; 
}


.timer-pause-row {
	z-index: 10000;
	width: 250px;
	position: absolute;
	bottom: 10px;
	right: 15px;
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	gap: 15px
}

.progress-timer {
	border-radius: 7px !important;
	overflow: hidden;
}

.close-button {
	position: absolute;
	top: 15px;
	right: 15px;
	z-index: 10000
}</style>
  