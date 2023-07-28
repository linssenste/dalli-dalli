<template>
    <div style="position: relative; padding-left: 20px; padding-right: 20px;">
        <div class="chart-base" v-on:click="selectPointsEvent(-1)">

            <div :style="`width: calc((100%/25000) * ${totalScore}); min-width: 46px; background-color: ${totalScore===0? '#505050!important':'white'}`"
                style="display: flex; flex-direction: row;  height: 100%; overflow: hidden;  border-radius: 23px; position: relative;">
                <!-- store.state.scoreList[i-1] -->
                <div v-for="i in 5" v-on:click.stop.prevent="selectPointsEvent(i-1)"
                    :style="`background-color: ${roundId===i-1? '#BB2D1BAA!important':'#BB2D1B'}; pointer-events: ${roundId===i-1? 'none':'auto'}; width: calc((100%/${totalScore}) * ${data.places[i-1].score}); `"
                    class="chart-round-points">
                    <div v-if="roundId==-1"
                        style="position: absolute; letter-spacing: 1px; color:white; right: 20px; top: 50%; transform: translateY(-50%); font-size: 17px; display: flex; flex-direction: row; align-items: center;">
                        <b>{{totalScore}}</b> <span style="font-weight: 500;  font-size: 17px; margin-left: 5px"></span>
                    </div>
                    <!-- <div v-if="roundId===i-1&&store.state.scoreList[i-1]>750"><span
                            v-if="store.state.scoreList[i-1]>2000">ROUND</span> {{roundId+1}}</div> -->

                </div>
            </div>





        </div>
        <div
            style="font-size: 16px; text-transform: uppercase; color: #808080; font-weight: 500; letter-spacing: 1px;  height: 24px; width: 100%;">
            <span v-if="roundId>=0&&roundId<5&&data.places[roundId].score===0">No
                Points scored</span>
            <span v-else-if="roundId>=0&&roundId<5">{{data.places[roundId].score}}
                POINTS <span style="color: #A0A0A0; margin-left: 10px;">
                    {{((data.places[roundId].score/totalScore)*100).toFixed(2)}}%</span></span>
            <span v-else>Select round for detailed breakdown</span>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { computed } from 'vue';

const emit=defineEmits(['selected']);
const props=defineProps<{
    roundId: number,
    data: any
}>();

function selectPointsEvent(roundId: number) {

    emit('selected', roundId);
}

const totalScore=computed(() => {
    let score=0;
    for (let i=0; i<props.data.places.length; i++) {
        score+=props.data.places[i].score;
    }
    return score;
});
props.roundId;
props.data;
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