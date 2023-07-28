<template>
    <div class="preview-image">

        <a class="photo-info-link pexels-link"><img
                src="https://help.pexels.com/hc/en-us/article_attachments/900006864786/Logo_on_Transparent.png"
                width="100" /></a>

        <a :href="locationImages[currentImageIndex].photographer_url" target="_blank"
            class="photo-info-link photographer-link"><i class="fa-solid fa-image"
                style="margin-right: 10px;" />{{locationImages[currentImageIndex].photographer}}</a>


        <div class="photo-info-link place-name">
            <img draggable="false" alt="United States"
                :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${place.countryId}.svg`" />

            <b>{{place.name}}</b>
        </div>
        <div class="container">
            <div v-if="!zoomImageLoaded" class="loading-overlay">
                <LoadingAnimation />
            </div>

            <vue-image-zoomer v-on:regular-loaded="loadedImageEvent" :show-message="false" :click-zoom="true"
                img-class="height" :regular="(locationImages[currentImageIndex].src)" />
        </div>
        <div class="preview-scroll-area">
            <div v-for="(image, index) in locationImages" v-on:click="currentImageIndex=index" class="other-image"
                style="scroll-margin-right: 20px;" :id="`preview-image-${index}`">
                <div class="overlay" :class="{ 'selected-overlay': index===currentImageIndex }"><i
                        style="position: absolute; left: 5px; top: 5px" v-if="index==0" class="fa-solid fa-gamepad" />
                </div>
                <img draggable="false" :src="image.src+'?auto=compress&cs=tinysrgb&h=260'" height="130" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { GameLocation } from '../settings/GameSetup.vue';
import LoadingAnimation from '../LoadingAnimation.vue';
import { VueImageZoomer } from 'vue-image-zoomer'
import 'vue-image-zoomer/dist/style.css';
const props=defineProps<{
    place: GameLocation,
}>();



const currentImageIndex=ref<number>(0);
watch(currentImageIndex, () => {
    zoomImageLoaded.value=false;

    const doc=document.getElementById(`preview-image-${currentImageIndex.value}`);
    if (doc) {
        doc.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
        });
    }
})

const locationImages=computed(() => {
    let images=props.place.images;


    // Remove the image from its current location
    let [imageIdSrc]=images.splice(props.place.imageId, 1);
    // Add the image back to the start of the array
    images.unshift(imageIdSrc);


    return images;
})


function loadedImageEvent(): void {
    setTimeout(() => {
        zoomImageLoaded.value=true;
    }, 500);
}
const zoomImageLoaded=ref(false);
props.place;
</script>



<style scoped>
.photo-info-link {

    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    z-index: 1000;

    display: flex;
    flex-direction: row;
    align-items: center;

    height: 45px;
    letter-spacing: .5px;
    font-weight: 500;
    font-size: 17px;
    border-radius: 10px;
    width: fit-content;
    background-color: #F0F0F0CC;
    color: #303030;
    padding-right: 15px;
    padding-left: 15px;
    border-radius: 6px;
    transition: all 100ms ease-in-out;

}

.photo-info-link:hover {
    background-color: #F0F0F0EE;
    color: #BB2D1B;
    transition: all 100ms ease-in-out;
}

.place-name {

    position: absolute;
    top: 15px;
    left: 15px;
    font-size: 22px;
    font-weight: 500;
    color: black;
    pointer-events: none;
    padding-right: 20px !important;
    z-index: 1000;
    /* box-shadow: 0px 0px 10px 0px #a0a0a0a0; */

}

.place-name img {
    width: 40px;
    border-radius: 2px;
    margin-right: 15px;
    font-size: 20px;
}

.photographer-link {
    position: absolute;
    bottom: 205px;
    right: 10px;

}




.preview-image {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;

    width: 100%;
    height: 100%;
    z-index: 500;
    background-color: white;
    position: relative;
}

.loading-overlay {
    z-index: 100;
    position: absolute;
    height: calc(100% - 200px);
    width: 100%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.pexels-link {
    position: absolute;
    bottom: 205px;
    left: 10px;
    padding-left: 5px;
    padding-right: 5px
}



.preview-scroll-area {
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    position: relative;
    height: 180px;
    max-height: 180px;
    padding-top: 20px;
}




.other-image {
    margin: 10px;
    border-radius: 10px;
    cursor: pointer;
    position: relative;
    transition: all 100ms ease-in-out;
}

.other-image:hover {
    transform: scale(1.03);
    transition: all 100ms ease-in-out;
}

.other-image img {
    border-radius: 5px;
}



.overlay {
    position: absolute;
    width: 100%;
    height: 100%;
    color: #BB2D1BAA;
    font-size: 25px;
    transition: all 50ms ease-in-out;
}


.selected-overlay {
    background-color: #FFFFFFAA;
    transition: all 50ms ease-in-out;

}
</style>



<style>
.container,
.vh--outer {


    background-color: black;
    width: 100%;
    height: calc(100vh - 200px)
}

.vh--holder {

    width: 100%;
    height: calc(100vh - 200px)
}

.height,
.vh--holder picture {
    /* position: absolute; */
    margin: auto;
    max-width: 100%;
    max-height: calc(100vh - 200px);

    /* height: 100%; */
}
</style>
