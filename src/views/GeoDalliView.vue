<template>
    <div v-if="loadingOverlay" class="loading-overlay">
        <LoadingAnimation />
    </div>

    <GameSetup v-if="gameModus===0||dalliGame==null" style="width: 100%; height: 100%;" v-on:loading="loadingOverlay=$event"
        v-on:start="startGame" />
    <GameMode v-else-if="gameModus===1" :data="dalliGame" v-on:loading="loadingOverlay=$event" />
</template>

<script lang="ts" setup>
import { ref, nextTick, computed, onMounted } from 'vue';
import { GameLocation, GameSettings } from '../components/settings/GameSettings.vue';
import GameSetup from '../components/settings/GameSetup.vue';
import GameMode from '../components/GameMode.vue';
import LoadingAnimation from '../components/LoadingAnimation.vue';
const gameModus=ref(0);
const dalliGame=ref<{ places: GameLocation[], settings: GameSettings }|null>(null)
const loadingOverlay=ref(false)
async function startGame(gameData: { places: GameLocation, settings: GameSettings }): Promise<void> {


    console.log("G", gameData)
    dalliGame.value={ ...gameData }
    gameModus.value=1;
    console.log(dalliGame.value)

}



</script>



<style scoped>
.loading-overlay {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>