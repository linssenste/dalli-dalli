<template>
    <div>

        <div class="shape-removal-settings">
            <i class="fa-solid fa-stopwatch" />

            Triangle Removal interval:
        </div>
        <div class="time-range">
            <input type="range" step="250" min="0" style="width: calc(100% - 100px); margin-left: 2px; " max="10000"
                v-model="removeTiming" />
            <div class="time-text"> <span v-if="removeTiming>0">{{removalTimeText}}</span> <span v-else>MANUAL</span></div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { computed, ref, watch } from 'vue';
import { store } from '../../store';
const removeTiming=ref(1000);



watch(removeTiming, () => {
    store.commit('setGameSettings', {
        interval: removeTiming.value>0? true:false,
        time: removeTiming.value
    });
})


const removalTimeText=computed(() => {
    if (removeTiming.value<1000) return `${removeTiming.value} ms`
    else return `${removeTiming.value/1000} s`
})

</script>


<style scoped>
.time-text {
    color: #808080;
    letter-spacing: 1px;
    padding-top: 15px
}

.shape-removal-settings {

    margin-top: 20px;
    font-size: 17px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: .5px;
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 10;
    width: 100%;
    text-align: start;
}

.shape-removal-settings i {
    color: #303030;
    margin-right: 10px;
    font-size: 18px;
}

.time-range {
    margin-top: -5px;
    margin-left: 5px;

    margin-bottom: 15px;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}



/* Custom styles for the slider */
.time-range input[type="range"] {
    -webkit-appearance: none;
    width: 100%;
    margin-top: 17px;
    height: 8px;
    border-radius: 5px;
    background-color: #e0e0e0;
    outline: none;
    /* Remove the default focus outline */
}

/* Styling for the slider thumb (WebKit-based browsers) */
.time-range input[type="range"]::-webkit-slider-thumb {
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
.time-range input[type="range"]:active::-webkit-slider-thumb,
.time-range input[type="range"]:hover::-webkit-slider-thumb {
    background-color: #BB2D1B;

    /* border: 2px solid #BABABA; */
    transition: all 200ms;
    /* Color when holding/sliding */
}

/* Styling for the slider thumb (Firefox) */
.time-range input[type="range"]::-moz-range-thumb {
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
.time-range input[type="range"]:active::-moz-range-thumb,
.time-range input[type="range"]:hover::-moz-range-thumb {
    background-color: #BB2D1B;
    /* border: 2px solid #BABABA; */
    transition: all 200ms;
    /* Color when holding/sliding */
}

.time-range input[type="range"]::-moz-range-progress {
    background: #BB2D1B;
    border-radius: 2px;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    height: 8px
}
</style>