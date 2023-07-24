<template>
    <div style="position: relative; padding-left: 20px; padding-right: 20px;">
        <div class="chart-base" v-on:click="selectPointsEvent(-1)">

            <div :style="`width: calc((100%/25000) * ${store.state.score})`"
                style="display: flex; flex-direction: row;  height: 100%; overflow: hidden; background-color: white; border-radius: 23px; position: relative;">
                <!-- store.state.scoreList[i-1] -->
                <div v-for="i in 5" v-on:click.stop.prevent="selectPointsEvent(i-1)"
                    :style="`background-color: ${roundId===i-1? '#BB2D1BAA':'#BB2D1B'}; pointer-events: ${roundId===i-1? 'none':'auto'}; width: calc((100%/${store.state.score}) * ${store.state.scoreList[i-1]}); `"
                    class="chart-round-points">

                    <!-- <div v-if="roundId===i-1&&store.state.scoreList[i-1]>750"><span
                            v-if="store.state.scoreList[i-1]>2000">ROUND</span> {{roundId+1}}</div> -->

                </div>
            </div>


            <div v-if="!(roundId===4&&store.state.score>21500)"
                style="position: absolute; letter-spacing: 1px; color:black; right: 25px; top: 50%; transform: translateY(-50%); font-size: 17px; display: flex; flex-direction: row; align-items: center;">
                <b>{{store.state.score}}</b> <span
                    style="font-weight: 500; color: #505050; font-size: 17px; margin-left: 5px">POINTS</span>
            </div>


        </div>
        <div
            style="font-size: 16px; text-transform: uppercase; color: #808080; font-weight: 500; letter-spacing: 1px;  height: 24px; width: 100%;">
            <span v-if="store.state.scoreList[roundId]===0">No
                Points scored</span>
            <span v-else-if="roundId>=0&&roundId<5">{{store.state.scoreList[roundId]}}
                POINTS</span>
            <span v-else>Select round for detailed breakdown</span>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { store } from '../../store';

const emit=defineEmits(['selected']);
const props=defineProps<{
    roundId: number,
}>();

function selectPointsEvent(roundId: number) {
    console.log("M")
    emit('selected', roundId);
}
props.roundId;

</script>

<style scoped>
.chart-base {
    user-select: none !important;
    -moz-user-select: none !important;
    -webkit-user-select: none !important;
    overflow: hidden;
    margin: 10px;
    display: flex;
    flex-direction: row;
    background-color: #EAEAEA;
    height: 46px;
    align-items: center;
    border-radius: 23px;
    position: relative;
}

.chart-round-points {

    transition: background-color 100ms ease-in-out;
    height: 100%;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    color: white;
    letter-spacing: 1px;
    font-weight: 500;
}



.chart-round-points:hover {
    background-color: #bb2d1bcc !important;
}
</style>