<template>
    <div v-if="gameMode===0" class="game-area">

        <DalliKlick class="dalli-area" :data="data" :roundId="currentRoundId" v-on:loading="loadingEvent"
            v-on:guess="userGuessEvent" />
        <!-- <MapSelector :data="data" :roundId="currentRoundId" v-on:submit="userGuessEvent" /> -->
    </div>

    <div v-else-if="gameMode===1" style="height: 100%; width: 100%; position: relative;;">
        <PlaceReview :data="data" :roundId="currentRoundId" v-on:continue="nextRoundEvent" />
    </div>

    <div v-else-if="gameMode===2">
        <GameReview :data="data" />
    </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { GameLocation, GameSettings } from '../components/settings/GameSettings.vue';
import DalliKlick from './DalliKlick.vue';
import MapSelector from './maps/MapSelector.vue';
import PlaceReview from './review/PlaceReview.vue';
import GameReview from './review/GameReview.vue';


const gameMode=ref(0)
const currentRoundId=ref(0)
const props=defineProps<{
    data: { places: GameLocation[], settings: GameSettings }
}>();

const emit=defineEmits(['loading'])
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
.dalli-area {
    height: 100%;
    width: 100%;
    max-width: calc(100% - 600px)
}

@media screen and (max-width: 800px) {
    .dalli-area {
        max-width: 100%;
    }
}



.game-area {
    position: fixed;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    overflow: hidden;
    justify-content: center;

}

@media screen and (max-width: 800px) {
    .game-area {
        flex-direction: column;
    }


}
</style>