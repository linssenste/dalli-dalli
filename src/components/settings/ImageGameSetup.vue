<template>
<div class="settings-container">
	<div class="settings-card">


		<img height="80" class="game-logo" src="../assets/game-logo.webp" />
		<ShapeSettings style="width: 100%;" v-on:update="settings = $event" />

		<div style="display: flex; flex-direction: row; align-items: center; width: 100%;gap: 15px">

			<!-- Input for image upload -->
			<input hidden id="attach-image" type="file" @change="handleFileUpload" accept="image/*" />
			<button v-on:click="uploadImageClick()" class="icon-button upload-button"><i
				   v-if="uploadedImage == null" class="fa-solid fa-upload" /><i v-else class="fa-solid fa-image"
				   style="color: #BB2D1B" /></button>
			<input v-model="link" :class="uploadedImage != null ? 'url-input-disabled' : ''" class="url-input"
				   placeholder="Add image by link" />


		</div>

		<!-- {{ isValidUrl }} -->
		<button class="start-button action-button" :class="(!isValidUrl && !uploadedImage) ? 'button-disabled' : ''"
				@click="showImage()">
			<i class="fa-solid fa-play "></i>
			<div>Show Image</div>
		</button>

	</div>
</div>

</template>
<template script lang="ts">


</template>