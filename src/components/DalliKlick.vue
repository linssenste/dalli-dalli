<template>
    <div class="game-wrapper">

        <div class="header" v-if="imageLoaded">
            <div class="difficulty-info">
                <i v-if="data.settings.difficulty===3"
                    style="font-size: 24px; color: #303030;  padding: 4px; border-radius: 50%;"
                    class="fa-solid fa-street-view" />
                <div v-else class="difficulty-icons">
                    <i class="fa-solid fa-star"></i>
                    <i v-if="data.settings.difficulty>=1" class="fa-solid fa-star"></i>
                    <i v-else class="fa-regular fa-star"></i>
                    <i v-if="data.settings.difficulty>=2" class="fa-solid fa-star"></i>
                    <i v-else class="fa-regular fa-star"></i>
                </div>


                <span style="font-weight: 500!important;"> <span v-if="!isMobile">Round <b>{{roundId+1}}</b> of
                        {{data.places.length}}</span><span v-else>{{roundId+1}}/{{data.places.length}}</span></span>
                <span v-if="!isMobile" style="color: #BB2D1B!important; margin-left: 20px;">{{totalScore}} POINTS</span>

            </div>

            <div class="difficulty-info">
                <span>
                    {{data.places[roundId].visibility.toFixed(2)}} %</span>

                <button style="width: 48px!important; height: 48px!important; margin-left: 25px;"
                    v-if="data.settings.interval>0" v-on:click="pauseEvent()" class="icon-button"><i
                        :style="pauseToggle? 'margin-left: 1px':''"
                        :class="`fa-solid fa-${!pauseToggle? 'pause':'play'}`" />

                </button>





            </div>


        </div>
        <div class="image">
            <div class="canvas-timer">
                <!-- Modify the ShapeCanvas component's width -->
                <ShapeCanvas v-on:click="hasRemoved=true" v-on:touchend="hasRemoved=true"
                    v-on:update="data.places[roundId].visibility=$event" v-on:loaded="imageLoaded=true"
                    :shapes="data.settings.shapes" :manual="data.settings.interval==0" :type="data.settings.type"
                    :image="image" :remove="revealToggle" :preview="false" style="width: 100%;" />
                <TimerProgress v-if="imageLoaded&&data.settings.interval>0" :pause="pauseToggle"
                    style="width: calc(100% + 1px);" :interval="data.settings.interval"
                    v-on:update="revealToggle=!revealToggle" />
                <div v-else-if="!hasRemoved" class="manual-hint">
                    Click on any shape <span v-if="!isMobile">or press space</span> to remove <span
                        v-if="!isMobile">shape</span></div>
            </div>

        </div>

    </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, watch, ref, onUnmounted } from 'vue';
import { GameLocation, GameSettings } from '../components/settings/GameSettings.vue';
import ShapeCanvas from './dalli/ShapeCanvas.vue';
import TimerProgress from './dalli/TimerProgress.vue';
const props=defineProps<{
    data: { places: GameLocation[], settings: GameSettings },
    roundId: number
}>();

const emit=defineEmits(['loading'])
const hasRemoved=ref(false)
const imageLoaded=ref(false)
const revealToggle=ref(false);
const pauseToggle=ref(false);
const image=computed(() => {
    return props.data.places[props.roundId].type===0? props.data.places[props.roundId].images[props.data.places[props.roundId].imageId].src+'?auto=compress&cs=tinysrgb&h=1250':props.data.places[props.roundId].image;
})

const totalScore=computed(() => {
    let score=0;
    for (let i=0; i<props.roundId; i++) {
        score+=props.data.places[i].score;
    }
    return score;
});
const windowWidth=ref(window.innerWidth);

const updateWidth=() => {
    windowWidth.value=window.innerWidth;
}


onMounted(() => {

    window.addEventListener('keydown', handleKeyboard)
    window.addEventListener('resize', updateWidth);

})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});
watch(revealToggle, () => {
    hasRemoved.value=true;
})

const isMobile=computed(() => {
    return windowWidth.value<1000;
})

watch(imageLoaded, () => {
    emit('loading', !imageLoaded.value)
}, { immediate: true })
function pauseEvent(): void {
    document.activeElement?.blur();
    pauseToggle.value=!pauseToggle.value;
}
function handleKeyboard(e: KeyboardEvent): void {
    hasRemoved.value=true
    if (imageLoaded.value&&e.code=='Space') pauseEvent()
}

props.data;
</script>


<style scoped>
.difficulty-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    font-weight: 500;
    color: #303030;
    margin-right: 10px;
}

.difficulty-info span {
    margin-left: 10px;
    text-transform: uppercase;
    font-size: 17px;
    color: #505050 !important;
}

.difficulty-icons {
    color: #F8DA5F;
    font-size: 20px;
}

.difficulty-icons i {
    margin: 2px;
}

.canvas-timer {
    width: 100%;
    position: relative;
    display: flex;
    padding-bottom: 50px;
    flex-direction: column;
    overflow: hidden;
    /* Hide any overflow from child elements */
}


.game-wrapper {
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;

    position: relative;
    height: 100%;
}

.header {
    height: 70px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-right: 5px;
    padding-left: 15px;
}

.header span {
    font-size: 18px;
    font-weight: 500;
    color: #303030;
}

.image {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    /* Hide any overflow from child elements */
}



.manual-hint {
    position: absolute;
    top: calc(50% - 25px);
    cursor: pointer;
    pointer-events: none;
    letter-spacing: .5px;
    text-align: center;
    left: 50%;
    width: 100%;
    transform: translate(-50%, -50%);
    z-index: 100;
    padding: 5px;
    text-transform: uppercase;
    font-size: 14px;
    color: #303030;
    font-weight: 500;
}
</style>