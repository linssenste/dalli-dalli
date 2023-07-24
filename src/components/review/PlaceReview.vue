<template>
    <div class="review-area">
        <div v-if="store.state.settings.difficulty!==3" class="preview-image">

            <img src="https://help.pexels.com/hc/en-us/article_attachments/900006864786/Logo_on_Transparent.png"
                class="preview-img" width="100" />

            <a :href="data.images[currentImageIndex].photographer_url" target="_blank" class="photographer-link"><i
                    class="fa-solid fa-image"
                    style="margin-right: 10px;" />{{data.images[currentImageIndex].photographer}}</a>
            <div class="container">
                <div v-if="!zoomImageLoaded" class="loading-overlay">
                    <LoadingAnimation />

                </div>
                <vue-image-zoomer :alt="data.images[currentImageIndex].alt" v-on:regular-loaded="zoomImageLoaded=true"
                    :show-message="false" :click-zoom="true" img-class="height" :regular="previewImage" />
                <!-- <img draggable="false"  :src="data.images[currentImageIndex]" /> -->
            </div>
            <div class="preview-scroll-area">
                <div v-for="(image, index) in data.images" v-on:click="currentImageIndex=index" class="other-image"
                    style="scroll-margin-right: 20px;" :id="`preview-image-${index}`">
                    <div class="overlay" :class="{ 'selected-overlay': index===currentImageIndex }"><i
                            style="position: absolute; left: 5px; top: 5px" v-if="index==imageId"
                            class="fa-solid fa-gamepad" />
                    </div>
                    <img draggable="false" :src="image.src.small" height="130" />
                </div>
            </div>
        </div>

        <StreetViewReview v-else-if="data.config!=null" class="preview-image" :image="data.image"
            :config="data.config.config" />

        <div class="map-container">

            <DistanceMap class="map" :location="position" :guess="propPosition" />

            <div class="info-container">
                <img v-if="store.state.settings.difficulty!==3" draggable="false" class="country-flag" alt="United States"
                    :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${data.countryId}.svg`" />
                <h1 v-if="store.state.settings.difficulty!==3">{{data.name}}</h1>
                <!-- <h1 v-else>{{data.latitude}}, {{data.longitude}}</h1> -->
            </div>
            <RoundStatsCards style="margin: 0 auto" :place="data" />
            <div class="points-progress-container">
                <div :style="roundScore>0? 'color: white;':' color: black'"
                    style="position: absolute; top: 50%; transform: translateY(-50%);  left: 18px; font-size: 20px; font-weight: 700">
                    {{roundScore}}</div>
                <div class="points-progress-bar" :style="`width: calc(${roundScore/5000}*100%)`">

                </div>
            </div>



            <!-- <div>{{data.shortDescription}}</div> -->
            <div v-if="store.state.settings.difficulty!=3" style="padding: 15px; text-align: justify; font-size: 17px;">
                <b>Nice to know: </b>{{data.funFact}}
            </div>

            <!-- {{roundScore}} -->

            <button class="next-button" v-on:click="nextRound()"><span v-if="roundId<4">Play Round {{roundId+2}}</span>
                <span v-else>Game Overview</span><i class="fa-solid fa-arrow-right" /></button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { getDistance } from 'geolib';
import { VueImageZoomer } from 'vue-image-zoomer'
import 'vue-image-zoomer/dist/style.css';
import LoadingAnimation from '../LoadingAnimation.vue';
import DistanceMap from '../maps/DistanceMap.vue';
import { store } from '../../store';
import StreetViewReview from '../maps/StreetViewReview.vue';
import RoundStatsCards from './RoundStatsCards.vue';

interface Place {
    name: string,
    countryId: string,
    latitude: string,
    longitude: string,
    shortDescription: string,
    funFact: string,
    difficulty: number,
    images: string[],
}

interface Location {
    lat: number,
    lng: number,
}

const zoomImageLoaded=ref(false)
const props=defineProps<{
    data: Place,
    imageId: number,
    roundId: number,
    location: Location|null,
    visibility: number
}>();
props.visibility;

const emit=defineEmits(['next'])
const currentImageIndex=ref(props.imageId)




watch(currentImageIndex, async () => {
    zoomImageLoaded.value=false
    await nextTick()

}, { immediate: true })
const position=computed(() => {
    return { lat: parseFloat(props.data.latitude), lng: parseFloat(props.data.longitude) }

});

const propPosition=computed(() => {
    return { lat: props.location.lat, lng: props.location.lng }
});

onMounted(() => {
    calculateScore(props.visibility, (getDistance(position.value, propPosition.value)/1000))


});


const roundScore=ref(0)
function calculateScore(visibility: number, distance: number): void {
    let D_score=0;
    let V_score=0;

    // Set score to zero if distance is more than 1000km
    if (distance>750) {
        D_score=0;
        V_score=0;
    } else {
        // Calculate distance score using a sigmoid function
        D_score=4000/(1+Math.exp((distance/5)-5));

        // Calculate visibility score using a sigmoid function
        V_score=1000-(900/(1+Math.exp((-visibility/3)+2)));
    }

    // Ensure the scores don't go below zero
    D_score=Math.max(D_score, 0);
    V_score=Math.max(V_score, 0);

    // Calculate total score
    let totalScore=D_score+V_score;

    if (distance<=.5&&visibility<2) totalScore=5000
    if (D_score===0) roundScore.value=0;
    else roundScore.value=Math.round(totalScore);

    store.commit('addScore', roundScore.value);
}


function nextRound(): void {

    emit('next')
}



const previewImage=computed(() => {
    return props.data.images[currentImageIndex.value].src.original+'?auto=compress&cs=tinysrgb&h=1250'
})


const distanceKm=computed(() => {
    return (getDistance(position.value, propPosition.value)/1000).toFixed(2);
});

const distanceMi=computed(() => {
    return (getDistance(position.value, propPosition.value)/1609.34).toFixed(2);
});

</script>

<style scoped>
.photographer-link {
    position: absolute;
    bottom: 210px;
    right: 10px;
    z-index: 500;
    background-color: #F0F0F0AA;

    color: black;
    padding: 10px;
    padding-right: 15px;
    padding-left: 15px;
    border-radius: 6px;
    transition: all 100ms ease-in-out;
}

.photographer-link:hover {
    background-color: #F0F0F0;
    color: #BB2D1B;
    transition: all 100ms ease-in-out;
}

.review-area {
    display: flex;
    flex-direction: row;
    width: 100vw;
    height: 100%;
    position: relative;
}

.preview-image {
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
    width: 50vw;
    max-width: 50vw;
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
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

.preview-img {
    position: absolute;
    bottom: 210px;
    left: 10px;
    z-index: 500;
    background-color: #F0F0F0AA;
    border-radius: 6px;
}

.preview-image img {
    border-radius: 6px;
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

.map-container {
    display: flex;
    flex-direction: column;
    width: 50vw;
    height: 100%;
    background-color: white;
    position: relative;
}

.map {
    width: 100%;
    height: 40%;
    min-height: 350px;
    overflow: hidden;
}

.points-progress-container {
    width: calc(100% - 20px);
    height: 40px;
    position: relative;
    margin: 10px;
    margin-top: 20px;
    background-color: #EAEAEA;
    border-radius: 20px;
    margin-bottom: 10px;
    overflow: hidden;
}

.points-progress-bar {
    height: 100%;
    background-color: #BB2D1B;
    border-radius: 20px;
}

.points-progress-bar span {
    text-align: end;
}



.other-image {
    margin: 10px;
    border-radius: 12px;
    cursor: pointer;
    position: relative;
    transition: all 100ms ease-in-out;
}

.other-image:hover {
    transform: scale(1.03);
    transition: all 100ms ease-in-out;
}

.active-image {
    border: 2px solid #BB2D1B;
    background-color: #BB2D1B;
}

.country-flag {
    width: 50px;
    border-radius: 5px !important;
    margin-right: 20px;
}

.info-container {

    padding-top: 15px;
    padding-bottom: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.info-container h1 {
    color: black;
    margin: 0px !important;
    padding: 0px !important
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
    background-color: #F0F0F0AA;
    transition: all 50ms ease-in-out;

}


.next-button {
    position: absolute;
    bottom: 15px;
    right: 15px;
    width: 250px;
    margin: 2px;
    background-color: #BB2D1B;
    color: white;
    font-weight: 700;

    border-radius: 25px;
    height: 50px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none !important
}

.next-button i {
    margin-left: 10px;
    font-size: 18px;
    border: none !important
}

.next-button:hover i {
    animation: move 1s;
}

@keyframes move {
    0% {
        padding-left: 0px;
    }

    25% {
        padding-left: 2px;
    }

    50% {
        padding-left: 0px;
    }

    75% {
        padding-left: 2px;
    }

    100% {
        padding-left: 0px;
    }
}

.next-button:hover {
    background-color: #BB2D1BDD;
    transition: all 100ms ease-in-out;
}
</style>



<style>
.container,
.vh--outer {

    width: 50vw;
    height: calc(100vh - 200px)
}

.vh--holder {

    width: 50vw;
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


