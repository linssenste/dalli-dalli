<template>
    <div>

        <div class="triangle-range">
            <button data-testid="shape-count-minus" v-on:click=" numTriangles=parseInt(String(numTriangles))-10"
                :class="{ 'button-disabled': (numTriangles)<=10 }" class="icon-button"><i
                    class="fa-solid fa-minus" /></button>
            <input data-testid="shape-count-slider" type="range" step="10" min="10" :max="250" v-model="numTriangles" />
            <button data-testid="shape-count-plus" v-on:click=" numTriangles=parseInt(String(numTriangles))+10"
                :class="{ 'button-disabled': (numTriangles)>=250 }" class="icon-button"><i
                    class="fa-solid fa-plus" /></button>
        </div>




        <div class="shape-settings-area">

            <ShapeCanvas data-testid="shape-canvas" :type="settings.type" :repeat="true" :manual="settings.interval==0"
                :remove="toggleShapeReveal" :shapes="settings.shapes" class="dalli-preview"
                image="https://assets.deutschlandfunk.de/FILE_6737e0eb35da9e37b9fcdda7955fb9df/1280x720.jpg?t=1621173620045">
            </ShapeCanvas>
            <div v-if="updatePreview" data-testid="shape-canvas-overlay" class="shape-overlay">
                <div class="shape-count-overlay">
                    ~ <b>{{numTriangles}}</b>
                    Shapes
                </div>
            </div>


        </div>
        <div style="height: 30px; ">
            <TimerProgress :preview="true" data-testid="image-timer" v-if="settings.interval!=0&&!updatePreview"
                v-on:update="toggleShapeReveal=!toggleShapeReveal" :interval="parseInt(String(settings.interval))"
                style="border-bottom-left-radius: 7px; border-bottom-right-radius: 7px; overflow: hidden;" />
            <div v-else-if="!updatePreview" data-testid="image-manual-text"
                style="font-size: 14px; padding-top: 3px; color: #c0c0c0; font-weight: 500; text-align: center; width: 100%; text-transform: uppercase;">
                Click
                Shape or press
                space to remove</div>
        </div>

        <ShapeTypeSelector data-testid="shape-type-selector" v-on:update="settings.type=$event" />
        <RemovalIntervalSettings data-testid="shape-removal-interval" v-on:update="settings.interval=$event" />
    </div>
</template>



<script lang="ts" setup>
import { ref, watch } from 'vue'

import ShapeCanvas from '../dalli/ShapeCanvas.vue';
import RemovalIntervalSettings from './RemovalIntervalSettings.vue';
import TimerProgress from '../dalli/TimerProgress.vue';
import ShapeTypeSelector from './ShapeTypeSelector.vue';


const toggleShapeReveal=ref(false);

const numTriangles=ref(50);
const triangleTimeout=ref<ReturnType<typeof setTimeout>|null>(null);
const updatePreview=ref(false);

const emit=defineEmits(['update'])

const settings=ref({
    interval: 0,
    shapes: 20,
    type: 'voronoi'
})


watch(settings, () => {
    emit('update', settings.value)
}, { deep: true, immediate: true })

watch(numTriangles, () => {

    updatePreview.value=true

    if (triangleTimeout.value) clearTimeout(triangleTimeout.value);

    triangleTimeout.value=setTimeout(() => {

        settings.value.shapes=numTriangles.value;
        updatePreview.value=false
    }, 550);

})


</script>


<style scoped>
.dalli-preview {
    position: relative;
    width: 100%;
    aspect-ratio: 16/9;
    background-color: #F0F0F0;

}

.shape-settings-area {
    width: 100%;
    position: relative;
    overflow: hidden;

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
    height: 100%;
    position: absolute;
    top: 0px;
    left: 0px;
    aspect-ratio: 16/9;
    width: 100%;
    background-color: #F0F0F0;
    z-index: 10000;
}


.triangle-range {


    margin-top: 25px;
    margin-bottom: 15px;
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
    height: 8px;
    width: calc(100% - 15px);
    border-radius: 5px;
    background-color: #f0f0f0;
    outline: none;
    transition: all 100ms;
    /* Remove the default focus outline */
}

.triangle-range input[type="range"]:active {

    background-color: #e0e0e0;
    transition: all 100ms;

}

.triangle-range input[type="range"]:hover {

    background-color: #e0e0e0;
    transition: all 100ms;

}

/* Styling for the slider thumb (WebKit-based browsers) */
.triangle-range input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background-color: #505050;
    /* Default unselected color */
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid white;

    transition: all 100ms;
    /* Remove the border */
}

/* Styling for the slider thumb when active/hovering (WebKit-based browsers) */
.triangle-range input[type="range"]:active::-webkit-slider-thumb,
.triangle-range input[type="range"]:hover::-webkit-slider-thumb {
    background-color: #303030;

    /* border: 2px solid #BABABA; */
    transition: all 100ms;
    /* Color when holding/sliding */
}

/* Styling for the slider thumb (Firefox) */
.triangle-range input[type="range"]::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background-color: #505050;
    /* Default unselected color */
    border-radius: 50%;
    cursor: pointer;

    transition: all 100ms;
    border: 2px solid white;
    /* Remove the border */
}

/* Styling for the slider thumb when active/hovering (Firefox) */
.triangle-range input[type="range"]:active::-moz-range-thumb,
.triangle-range input[type="range"]:hover::-moz-range-thumb {
    background-color: #303030;

    /* border: 2px solid #BABABA; */
    transition: all 100ms;
    /* Color when holding/sliding */
}
</style>