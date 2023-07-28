<template>
    <!-- <div v-if="isIncompatible"
        style="padding: 20px; padding-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <img draggable="false" class="logo" src="./assets/game-logo.webp" width="300" height="112" />

        <div style="font-size: 18px; color: black!important; font-weight: 500; max-width: 500px; margin-top: 30px;">Sorry,
            this game is designed for
            Desktop
            computers. But I'm working on it!
        </div>

    </div> -->
    <div class="geo-dalli-area">

        <!-- game settings if new game and not configures -->
        <div v-if="mode===0" class="game-settings-overlay" data-testid="game-settings-area">
            <GameSettings v-on:start="startGame" />
        </div>

        <!-- running game mode -->
        <div v-else-if="mode===0" class="game-mode">

            <!-- loading screen -->
            <div v-if="!imageLoaded" class="loading-overlay" data-testid="game-loading-overlay">
                <LoadingAnimation />
            </div>


            <!-- dalli game for image -->
            <DalliKlick v-if="places[currentIndex]!=null" class="game-image" data-testid="game-image-area"
                v-on:loaded="imageLoaded=true" v-on:update="visibilityPercentage=$event" v-bind:image="dalliImage" />

            <!-- map for guessing location -->
            <MapSelector v-if="places[currentIndex]!=null" :roundId="currentIndex" class="game-map"
                data-testid="game-map-area" v-on:submit="submitEvent" />

        </div>

        <!-- round review  -->
        <PlaceReview v-else-if="mode==1&&currentIndex>=0" data-testid="round-review-view" :visibility="visibilityPercentage"
            :location="inputPlaceGuess" :key="currentIndex" :roundId="currentIndex" v-on:next="nextRound()"
            :imageId="imageId||0" :data="places[currentIndex]">
        </PlaceReview>


        <!-- overall game review -->
        <GameReview v-else-if="mode===2" :places="places" data-testid="game-review-view" />


    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed, onMounted } from 'vue';
import { store } from '../store';

import DalliKlick from '../components/DalliKlick.vue';
import MapSelector from '../components/maps/MapSelector.vue';

import GameSettings from '../components/settings/GameSettings.vue';

import GameReview from '../components/review/GameReview.vue';
import PlaceReview from '../components/review/PlaceReview.vue';

import LoadingAnimation from '../components/LoadingAnimation.vue';
import axios from 'axios';
import { getAuth, signInAnonymously } from "firebase/auth";

interface Location {
    lat: number,
    lng: number
}


const places=ref<any>([]);
const inputPlaceGuess=ref<null|Location>(null);

const imageLoaded=ref(false)
const visibilityPercentage=ref(0);
let currentIndex=ref(-1);
const mode=ref(0)


onMounted(async () => {


    const auth=getAuth();
    console.log(auth)
    signInAnonymously(auth)
        .then(() => {
            console.log("SIGNED IN")
            // Signed in..
        })
        .catch((error) => {
            const errorCode=error.code;
            const errorMessage=error.message;
            // ...
        });


})


const imageId=computed(() => {

    if (store.state.settings.difficulty!==3&&places.value!=null&&places.value.length>0&&places.value[currentIndex.value]!=null) {
        return Math.floor(Math.random()*(places.value[currentIndex.value].images.length-1));
    }
    return 0;
})


const isIncompatible=computed(() => {
    return !(window.innerWidth>window.innerHeight&&window.innerWidth>1000)
})



async function startGame({ places, settings }): Promise<void> {

    console.log("H", places)
    places.value=places;
    await nextTick()

    currentIndex.value=0;
    mode.value=0;
    document.title=`GEODALLI - ${currentIndex.value+1}/5`;
}


async function submitEvent(location: Location): Promise<void> {
    inputPlaceGuess.value=location;

    if (inputPlaceGuess.value==null) {
        return;
    }

    places.value[currentIndex.value].imageId=imageId.value;
    places.value[currentIndex.value].guess=inputPlaceGuess.value;
    places.value[currentIndex.value].visibility=visibilityPercentage.value;

    await nextTick();
    mode.value=1;

}
function nextRound(): void {

    imageLoaded.value=false;
    if (currentIndex.value+1==5) {
        document.title=`GEODALLI - Game overview`;
        mode.value=2;
        return;
    }
    mode.value=0;
    currentIndex.value+=1
    document.title=`GEODALLI - ${currentIndex.value+1}/5`;

}


</script>



<style scoped>
.game-image {
    width: 60%;
    max-width: calc(100% - 500px)
}


.game-map {
    position: relative;
    width: 40%;
    min-width: 500px;
    height: 100vh;
}

.game-mode {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
}

.game-settings-overlay {
    overflow-x: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFFF0;
}

.geo-dalli-area {
    width: 100%;
    height: 100%;
    position: relative;
}

.loading-overlay {
    z-index: 100;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>