<template>
    <div v-if="gameMode===0" class="game-area">

        <DalliKlick class="dalli-area" :data="data" :roundId="currentRoundId" v-on:loading="loadingEvent"
            v-on:guess="userGuessEvent" />
        <button v-if="isMobile" v-on:click="showMap=!showMap" class="reveal-map-button action-button">
            <i class="fa-solid fa-map" />Select location</button>

        <!-- <transition name="slide-up-down" mode="out-in"> -->
        <!-- <div v-show="!isMobile||showMap" :class="isMobile? 'mobile-map':'map'">
                <button v-show="isMobile" v-on:click.stop.prevent="showMap=false"
                    style="position: absolute; top: 17px; left: 15px; z-index: 10000!important; pointer-events: all;"
                    class="icon-button"><i class="fa-solid fa-xmark" /></button> -->
        <MapSelector class="map" :data="data" :roundId="currentRoundId" v-on:submit="userGuessEvent" />
        <!-- </div> -->
        <!-- </transition> -->

    </div>

    <div v-else-if="gameMode===1" style="height: 100%; width: 100%; position: relative;;">
        <PlaceReview :data="data" :roundId="currentRoundId" v-on:continue="nextRoundEvent" />
    </div>

    <div v-else-if="gameMode===2">
        <GameReview :data="data" />
    </div>
</template>
<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { GameLocation, GameSettings } from '../components/settings/GameSettings.vue';
import DalliKlick from './DalliKlick.vue';
import MapSelector from './maps/MapSelector.vue';
import PlaceReview from './review/PlaceReview.vue';
import GameReview from './review/GameReview.vue';

const showMap=ref(false)
const gameMode=ref(0)
const currentRoundId=ref(0)
const props=defineProps<{
    data: { places: GameLocation[], settings: GameSettings }
}>();

const emit=defineEmits(['loading'])
const windowWidth=ref(window.innerWidth);

const updateWidth=() => {
    windowWidth.value=window.innerWidth;
}

onMounted(() => {
    window.addEventListener('resize', updateWidth);
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});


const isMobile=computed(() => {
    return windowWidth.value<1000;
})

function loadingEvent(loadingStatus: boolean): void {
    emit('loading', loadingStatus)
}
function userGuessEvent(guessPosition: { lat: number, lng: number }): void {
    props.data.places[currentRoundId.value].guess=guessPosition;
    gameMode.value=1;

}

function nextRoundEvent(): void {
    if (currentRoundId.value>=props.data.places.length-1) {
        currentRoundId.value=0;
        gameMode.value=2;
        return
    } else {
        currentRoundId.value++;
        gameMode.value=0;
    }

}

props.data;
</script>


<style scoped>
.map {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.dalli-area {
    height: 100%;
    width: 100%;
    max-width: calc(100% - 600px)
}

@media screen and (max-width: 1000px) {
    .dalli-area {
        max-width: 100%;
    }
}



.game-area {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

}

@media screen and (max-width: 1000px) {
    .game-area {
        flex-direction: column;
    }


}

.reveal-map-button {
    position: absolute;
    bottom: 15px;
    left: 50%;
    width: calc(100% - 20px);
    transform: translateX(-50%);
}

.slide-up-down-enter-active {
    transition: all 0.2s ease-in-out;
}

.slide-up-down-leave-active {
    transition: all 0.2s ease-in-out;
}

.slide-up-down-enter-from,
.slide-up-down-leave-to {
    transform: translateY(100%);
}

.slide-up-down-enter-to,
.slide-up-down-leave-from {
    transform: translateY(0);
}

.slide-up-down-enter-active,
.slide-up-down-leave-active {
    transition: transform 0.3s;
}


.mobile-map {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100%;
    z-index: 1000;
}
</style>