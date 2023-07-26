<template>
    <div style="position: relative; width: 100%; height: 100%; overflow: hidden; user-select: none; background-color: #F0F0F0;"
        :style="!hasInterval? 'cursor: pointer':''" v-on:click="removeShape(true)">

        <div class="control-area">

            <span>{{visiblePercentage.toFixed(2)}}
                %</span>

            <div style="display: flex; flex-direction: row; align-items: center;">
                <span v-if="isPaused&&hasInterval"
                    style="color: #A0A0A0; font-size: 14px; text-transform: uppercase; letter-spacing: .5px;">Press Space to
                    continue</span>
                <i v-if="hasInterval" class="pause-button" :style="isPaused? 'color: #BB2D1B':''" @click="toggleTimer"
                    :class="`fa-solid fa-circle-${!isPaused? 'pause':'play'}`" />
                <span v-else style="color: #A0A0A0; font-size: 14px; text-transform: uppercase; letter-spacing: .5px;">
                    Click anywhere to remove Triangle

                </span>


            </div>

        </div>



        <div
            style="position: relative; ; position: absolute; top: calc(50% + 25px); left: 50%; transform: translate(-50%, -50%); width: 100%; ">

            <ShapeCanvas :remove="removeTrigger" :image="image" />

            <div v-if="visiblePercentage==0&&!preview&&store.state.settings.interval==false"
                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: #A0A0A0; font-size: 14px; text-transform: uppercase; letter-spacing: .5px;">
                Click anywhere or Press Space to
                start</div>

        </div>



    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { store } from '../store';
import ShapeCanvas from './dalli/ShapeCanvas.vue';


const visiblePercentage=ref<number>(0);  // New: The visible percentage of the image

const removeTrigger=ref(false)

// const emit=defineEmits(['update', 'loaded'])
const props=defineProps<{
    image: string,
    preview?: boolean
}>();
props.preview




onMounted(async () => {

    startGame()
    window.addEventListener('keydown', pauseKeyboardEvent)

    // Attach resize event listener to update the canvas size when window is resized

});
onBeforeUnmount(() => {
    // Clean up event listener
    window.removeEventListener('keydown', pauseKeyboardEvent)


});


function pauseKeyboardEvent(e: KeyboardEvent): void {

    if (e.code==='Space') {
        if (!hasInterval.value) removeShape(true)
        else toggleTimer();
    }

}

const isPaused=ref(false)
function toggleTimer(): void {

    isPaused.value=!isPaused.value;
}

const autoTimer=ref<any>(null);


const hasInterval=computed(() => store.state.settings.interval)


function startGame(): void {


    isPaused.value=false;

    visiblePercentage.value=0; // reset the visible percentage to 0


    if (props.preview!=true&&!hasInterval.value) return;


    if (autoTimer.value!=null) clearInterval(autoTimer.value);

    removeShape()
    autoTimer.value=setInterval(() => {
        removeShape()
    }, store.state.settings.time)



}


onBeforeUnmount(() => {
    clearInterval(autoTimer.value)
})


function removeShape(manual=false) {
    console.log(manual)
    removeTrigger.value=!removeTrigger.value
}

</script>

<style scoped>
canvas {
    max-width: 100%;
    max-height: 100%;
    background-color: #F0F0F0;
    border: 0px solid black;

}

.pause-button {
    margin-left: 20px;
    font-size: 40px;
    border-radius: 20px;
    color: black;
    transition: all 100ms ease-in-out;
    cursor: pointer;
}

.pause-button:hover {
    color: #BB2D1B;
    transition: all 100ms ease-in-out;
}




.control-area {
    position: absolute;
    top: 0px;
    width: calc(100% - 40px);
    padding-left: 20px;
    padding-right: 20px;
    height: 75px;
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}

.control-area span {
    font-size: 18px;
    font-weight: 700;
}
</style>
