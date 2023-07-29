<template>
    <LoadingOverlay v-if="loadingOverlay" class="loading-overlay" />


    <GameSetup v-if="gameModus===0||dalliGame==null" class="game-mode-view" v-on:loading="loadingOverlay=$event"
        v-on:start="startGame" />
    <GameMode v-else-if="gameModus===1" :data="dalliGame" class="game-mode-view" v-on:loading="loadingOverlay=$event" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { GameLocation, GameSettings } from '../components/settings/GameSettings.vue';
import GameSetup from '../components/settings/GameSetup.vue';
import GameMode from '../components/dalli/GameMode.vue';
import LoadingOverlay from '../components/helper/LoadingOverlay.vue';
const gameModus=ref(0);
const dalliGame=ref<{ places: GameLocation[], settings: GameSettings }|null>(null)
const loadingOverlay=ref(false)
async function startGame(gameData: { places: GameLocation, settings: GameSettings }): Promise<void> {

    dalliGame.value={ ...gameData }
    gameModus.value=1;

}



</script>



<style scoped>
.game-mode-view {
    width: 100%;
    height: 100%;
    position: relative;
    top: 0;
    left: 0;
}

.loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}
</style>