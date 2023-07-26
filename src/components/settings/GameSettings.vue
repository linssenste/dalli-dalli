<template>
    <!-- <div class="settings-area"> -->

    <div class="game-settings">

        <DifficultySettings v-on:change="updateSettingsEvent" />
        <ShapeSettings v-on:update="updateSettingsEvent" />

        <!-- start game button -->
        <button class="start-button" @click="startGame()">
            <i class="fa-solid fa-play "></i>
            <div>Start Game</div>
        </button>


    </div>

    <!-- <GameInformation /> -->
    <!-- <a class="copyright-link" href="https://linssenste.com">
            <span
                style="font-family: 'biro_script_standardregular'; font-size: 35px; margin-top: 25px; margin-right: 10px">©
            </span>
            <span style="font-family: 'biro_script_standardregular'; font-size: 25px;">Steffen Linßen</span>
        </a> -->

    <!-- </div> -->
</template>



<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import ShapeSettings from './ShapeSettings.vue';
import DifficultySettings from './DifficultySettings.vue';
import { store } from '../../store';

const emit=defineEmits(['start'])


onMounted(() => {

    document.title=`GEODALLI`;
})


const settings=ref(store.state.settings)
function updateSettingsEvent(data: any) {
    settings.value={ ...settings.value, ...data }
}
function startGame(): void {
    store.commit('setGameSettings', {
        configured: true,
        ...settings.value
    })

    emit('start')
}
</script>


<style scoped>
.copyright-link {
    z-index: 100;
    position: absolute;
    top: -15px;
    right: 15px;
    font-weight: 500;
    color: #1a42ba;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

}

.copyright-link:hover {
    transform: scale(1.01);
    transition: all 200ms ease-in-out;
}

.game-settings {
    position: relative;
    display: flex;
    padding: 5px;
    flex-direction: column;
    width: 100%;
    max-width: 450px;
}

.start-button {
    width: 100%;
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
    border: none !important;
    transition: all 200ms;

    margin-top: 20px;
}

.start-button:hover {
    background-color: #BB2D1BDD;
    transition: all 200ms;
}

.start-button i {
    margin-right: 10px;
    font-size: 18px;
    border: none !important
}


.settings-area {
    display: flex;
    user-select: none;
    flex-direction: row;
    position: relative;
    align-items: center;
    width: 100%;
    height: 100%;
    justify-content: space-evenly;
}
</style>