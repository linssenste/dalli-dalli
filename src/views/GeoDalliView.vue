<template>
    <GameSetup v-if="gameModus===0||dalliGame==null" style="width: 100%; height: 100%;" v-on:start="startGame" />
    <GameMode v-else-if="gameModus===1" :data="dalliGame" />
</template>

<script lang="ts" setup>
import { ref, nextTick, computed, onMounted } from 'vue';
import { GameLocation, GameSettings } from '../components/settings/GameSettings.vue';
import GameSetup from '../components/settings/GameSetup.vue';
import GameMode from '../components/GameMode.vue';
const gameModus=ref(0);
const dalliGame=ref<{ places: GameLocation[], settings: GameSettings }|null>(null)

async function startGame(gameData: { places: GameLocation, settings: GameSettings }): Promise<void> {


    console.log("G", gameData)
    dalliGame.value={ ...gameData }
    gameModus.value=1;
    console.log(dalliGame.value)

}



</script>



<style scoped></style>