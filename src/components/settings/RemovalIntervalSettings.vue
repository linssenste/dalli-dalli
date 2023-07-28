<template>
    <div>

        <div class="time-range">

            <input data-testid="input-range" type="range" step="1000" min="0" max="10000" v-model="removeTiming" />
            <div data-testid="time-text" class="time-text"> <span v-if="removeTiming>0">{{removalTimeText}}</span> <span
                    v-else>MANUAL</span></div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { computed, ref, watch } from 'vue';

const emit=defineEmits(['update'])
const removeTiming=ref(parseInt(((new URL(document.location as any)).searchParams).get('interval')||'2000'));



watch(removeTiming, () => {
    emit('update', removeTiming.value)
}, { immediate: true })


const removalTimeText=computed(() => {
    if (removeTiming.value<1000) return `${removeTiming.value} ms`
    else return `${removeTiming.value/1000} s`
})

</script>


<style scoped>
.time-text {
    color: #303030;
    letter-spacing: 1px;
    font-weight: 500 !important;
    padding-top: 15px
}

.shape-removal-settings {

    margin-top: 10px;
    font-size: 17px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 5px;
    display: flex;
    flex-direction: row;
    align-items: center;
    z-index: 10;
    color: #303030;
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

    margin-left: 2px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}



/* Custom styles for the slider */
.time-range input[type="range"] {

    -webkit-appearance: none;
    width: calc(100% - 90px);
    margin-top: 17px;
    height: 8px;
    border-radius: 5px;
    transition: all 100ms;
    background-color: #f0f0f0;
    /* Remove the default focus outline */
}

.time-range input[type="range"]:active {

    background-color: #e0e0e0;
    transition: all 100ms;

}

.time-range input[type="range"]:hover {

    background-color: #e0e0e0;
    transition: all 100ms;

}

/* Styling for the slider thumb (WebKit-based browsers) */
.time-range input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background-color: #303030;
    /* Default unselected color */
    border-radius: 50%;
    cursor: pointer;


    border: 2px solid white;
    transition: all 200ms;
    /* Remove the border */
}

/* Styling for the slider thumb when active/hovering (WebKit-based browsers) */
.time-range input[type="range"]:active::-webkit-slider-thumb,
.time-range input[type="range"]:hover::-webkit-slider-thumb {
    background-color: #303030;

    /* border: 2px solid #BABABA; */
    transition: all 200ms;
    /* Color when holding/sliding */
}

/* Styling for the slider thumb (Firefox) */
.time-range input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border: 2px solid white;
    background-color: #303030;
    /* Default unselected color */
    border-radius: 50%;
    cursor: pointer;

    transition: all 200ms;

    /* Remove the border */
}

/* Styling for the slider thumb when active/hovering (Firefox) */
.time-range input[type="range"]:active::-moz-range-thumb,
.time-range input[type="range"]:hover::-moz-range-thumb {
    background-color: #303030;

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