<template>
    <div class="shape-settings-area">

        <div class="shape-type-settings">
            <i class="fa-solid fa-image" />Dalli Settings:
        </div>
        <div v-if="updatePreview" class="shape-overlay">
            <div class="shape-count-overlay">
                <b>{{numTriangles}}</b>
                Shapes
            </div>
        </div>
        <DalliKlick v-else :key="`${gameDifficulty}-${gameInterval}`" :preview="true" :pause="false" style="height: 310px; "
            image="https://assets.deutschlandfunk.de/FILE_6737e0eb35da9e37b9fcdda7955fb9df/1280x720.jpg?t=1621173620045" />

        <div class="triangle-range">
            <input type="range" step="10" min="10" :max="gameDifficulty===3? 1000:250" v-model="numTriangles" />
        </div>
    </div>
</template>



<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { store } from '../../store';

import DalliKlick from '../DalliKlick.vue';


const numTriangles=ref(50);
const triangleTimeout=ref<ReturnType<typeof setTimeout>|null>(null);
const updatePreview=ref(false);


const gameDifficulty=computed(() => store.state.settings.difficulty);
const gameInterval=computed(() => store.state.settings.time);


watch(gameDifficulty, () => {
    if (gameDifficulty.value!==3&&numTriangles.value>250) numTriangles.value=250
})

watch(numTriangles, () => {

    updatePreview.value=true

    if (triangleTimeout.value) clearTimeout(triangleTimeout.value);

    triangleTimeout.value=setTimeout(() => {

        store.commit('setGameSettings', {
            configured: false,
            triangles: numTriangles.value,
        });
        updatePreview.value=false
    }, 500);

})

watch(numTriangles, () => {
    store.commit('setGameSettings', {
        triangles: numTriangles.value
    });
})



</script>




<style scoped>
.shape-settings-area {
    width: 485px;
    margin: 5px;
    margin-top: 10px;
    height: 360px;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
    background-color: #F0F0F0
}


.shape-type-settings {
    position: absolute;
    top: 13px;
    font-size: 17px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
    margin-left: 18px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 10
}

.shape-type-settings i {
    color: #303030;
    margin-right: 10px;
    font-size: 17px;
}

.shape-count-overlay {
    position: absolute;
    text-transform: uppercase;
    letter-spacing: .5px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}


.shape-overlay {
    position: absolute;
    top: 40px;
    left: 0;
    height: calc(100% - 90px);
    width: 100%;
    background-color: #F0F0F0AA;
    z-index: 10;
}


.triangle-range {
    position: absolute;
    bottom: 7px;
    height: 50px;
    align-items: center;
    justify-content: center;



    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}

/* Custom styles for the slider */
.triangle-range input[type="range"] {
    -webkit-appearance: none;
    width: calc(100% - 40px);
    margin-left: 20px;
    margin-right: 20px;
    margin-top: 17px;
    height: 8px;
    width: calc(100% - 15px);
    border-radius: 5px;
    background-color: #e0e0e0;
    outline: none;
    /* Remove the default focus outline */
}

/* Styling for the slider thumb (WebKit-based browsers) */
.triangle-range input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background-color: #A0A0A0;
    /* Default unselected color */
    border-radius: 50%;
    cursor: pointer;
    border: none;

    transition: all 200ms;
    /* Remove the border */
}

/* Styling for the slider thumb when active/hovering (WebKit-based browsers) */
.triangle-range input[type="range"]:active::-webkit-slider-thumb,
.triangle-range input[type="range"]:hover::-webkit-slider-thumb {
    background-color: #BB2D1B;

    /* border: 2px solid #BABABA; */
    transition: all 200ms;
    /* Color when holding/sliding */
}

/* Styling for the slider thumb (Firefox) */
.triangle-range input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background-color: #A0A0A0;
    /* Default unselected color */
    border-radius: 50%;
    cursor: pointer;

    transition: all 200ms;
    border: none;
    /* Remove the border */
}

/* Styling for the slider thumb when active/hovering (Firefox) */
.triangle-range input[type="range"]:active::-moz-range-thumb,
.triangle-range input[type="range"]:hover::-moz-range-thumb {
    background-color: #BB2D1B;

    /* border: 2px solid #BABABA; */
    transition: all 200ms;
    /* Color when holding/sliding */
}
</style>