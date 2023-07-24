<template>
    <div style="overflow: hidden; position: relative;">

        <!-- map + score counter -->
        <div class="score-map-area" :id="reviewIndex==-1? 'honeycomb':''">

            <!-- round map review (distance between points) -->
            <DistanceMap v-if="places!=null&&reviewIndex>=0&&reviewIndex<5" class="round-map"
                :location="{ lat: parseFloat(places[reviewIndex].latitude), lng: parseFloat(places[reviewIndex].longitude) }"
                :guess="places[reviewIndex].guess" />

            <!-- score counter/landing view -->
            <div v-else class="overview-text">

                <ConfettiExplosion class="hidden-confetti" v-if="showConfetti" />

                <img draggable="false" style="margin-bottom: 15px; margin-top: 12px;" class="logo"
                    src="../../assets/game-logo.webp" width="275" height="102" />

                <div id="value" style="font-size: 100px; color: #BB2D1B;  height: 125px; font-weight: 700; z-index: 100">
                    {{store.state.score}}
                </div>
                <div
                    style="font-size: 20px;text-transform: uppercase; z-index: 10000; letter-spacing: 1px; font-weight: 500; color: black">
                    POINTS</div>


                <div class="fade-border">
                </div>
            </div>

            <button v-on:click.stop.prevent="newGameEvent()" class="new-game-button">

                <i class="fa-solid fa-arrow-rotate-left" />Play again
            </button>

            <button v-if="reviewIndex!=-1" v-on:click.stop.prevent="reviewIndex=-1" class="close-button"><i
                    class="fa-solid fa-xmark" /></button>

        </div>



        <div
            style="display: flex;  height: 50px; flex-direction: row; justify-content: space-between; align-items: center; margin: 30px; margin-top: 20px; margin-bottom: 20px;">
            <div style="font-size: 25px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                <span v-if="reviewIndex==-1">Game Breakdown:</span>
                <span v-else>ROUND {{reviewIndex+1}}:</span>
            </div>

            <RoundStatsCards v-if="places!=null&&reviewIndex>=0&&reviewIndex<5" :score="store.state.scoreList[reviewIndex]"
                :place="places[reviewIndex]" />


        </div>

        <PointsBreakdownChart :roundId="reviewIndex" v-on:selected="reviewIndex=$event" />

        <div v-if="places!=null" class="image-review">
            <div v-for="(place, index) in places" class="image-area">
                <!-- {{place}} -->
                <div v-on:click.stop.prevent="reviewIndex!=index? reviewIndex=index:reviewIndex=-1"
                    :style="reviewIndex==index? 'color: #BB2D1B; font-weight: 700':''"
                    style="position: relative;height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">

                    <!-- <div
                        style="position: absolute; top: 0px; font-size: 18px; display: flex; flex-direction: row; align-items: center; justify-content: center; width: 100%;">

                        {{index+1}}. <span v-if="store.state.settings.difficulty===3">{{place.latitude}}, {{
                            place.longitude}}</span><span v-else>{{place.name}}</span>
                    </div> -->

                    <img draggable="false" :width="reviewIndex==index? 290:195" style="transition: all 150ms linear;"
                        :src="store.state.settings.difficulty===3? place.image:place.images[place.imageId].src.original+'?auto=compress&cs=tinysrgb&h=350'" />

                </div>
            </div>


        </div>

    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref } from 'vue';

import DistanceMap from '../maps/DistanceMap.vue';
import { store } from '../../store';
import PointsBreakdownChart from './PointsBreakdownChart.vue';
import RoundStatsCards from './RoundStatsCards.vue';
import ConfettiExplosion from "vue-confetti-explosion";

const props=defineProps<{
    places: any[],
}>()


const reviewIndex=ref(-1);
const showConfetti=ref(false)
function newGameEvent() {
    location.reload();
}

function animateValue(obj, start, end, duration) {
    let startTimestamp=null;
    const step=(timestamp) => {
        if (!startTimestamp) startTimestamp=timestamp;
        const progress=Math.min((timestamp-startTimestamp)/duration, 1);
        obj.innerHTML=Math.floor(progress*(end-start)+start);
        if (progress<1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}
onMounted(() => {
    const obj=document.getElementById("value");






    animateValue(obj, 0, store.state.score, 1500);
    if (store.state.score>=20000) {


        setTimeout(() => {
            showConfetti.value=true;
            setTimeout(() => {
                showConfetti.value=false;
            }, 5000);
        }, 1550);
    }
})





props.places;
</script>


<style scoped lang="scss">
.hidden-confetti {
    position: absolute;
    top: 50%;
    height: 10px;
    width: 10px;
    background-color: red;

}

.round-map {
    width: 100%;
    height: 100%;
    position: relative;
}

.score-map-area {
    width: 100%;
    height: 300px !important;
    position: relative;
}

.close-button {
    position: absolute;
    top: 15px;
    left: 15px;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-color: #BB2D1BEE;
    padding: 10px;
    border-radius: 25px;

    width: 40px;
    height: 40px;
    display: flex;
    color: white;
    flex-direction: row;
    align-items: center;
    transition: all 200ms;
    box-shadow: 2px 2px 15px 2px #00000033;
    border: none !important
}

.close-button i {
    position: absolute;
    top: 50%;
    font-size: 20px;
    left: 50%;
    transform: translate(-50%, -50%);
}

.close-button:hover {
    background-color: #BB2D1B;
    transition: all 200ms;

}

.new-game-button {
    box-shadow: 2px 2px 15px 2px #00000033;
    position: absolute;
    top: 15px;
    right: 15px;
    color: white;
    text-transform: uppercase;
    letter-spacing: 1px;
    background-color: #BB2D1BEE;
    padding: 10px;
    border-radius: 12px;
    padding-left: 20px;
    padding-right: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    transition: all 200ms;
    border: none !important;
    z-index: 100;

}

.new-game-button:hover {
    background-color: #BB2D1B;
    transition: all 200ms;
    transform: scale(1.01);
}

.new-game-button:hover i {
    transform: rotate(-360deg);
    transition: all 750ms;
}

.new-game-button i {
    margin-right: 10px;
}

.fade-border {
    position: absolute;
    bottom: 0px;
    width: 100%;
    height: 1px;
    border-radius: 0px !important;
    transform: rotate(180deg);
    background-color: white;
}

.fade-border::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 200px;
    background: linear-gradient(to bottom, white, transparent);
}

.overview-text {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: #FAFAFACC;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    z-index: 100 !important;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    /* Add the backdrop filter */
    backdrop-filter: blur(6px);
    /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(10px);
    /* For compatibility with some browsers */
}

#honeycomb {
    width: 100%;
    height: 100%;
    background: center url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(187, 45, 27, 1)' viewBox='0 0 100 169.5'%3E%3Cpolygon points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'%3E%3C/polygon%3E%3Cpolygon points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'%3E%3C/polygon%3E%3Cpolygon points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'%3E%3C/polygon%3E%3Cpolygon points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'%3E%3C/polygon%3E%3Cpolygon points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'%3E%3C/polygon%3E%3C/svg%3E");
    background-size: 60px;
    animation: slide 5s linear infinite;
}

@keyframes slide {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -60px 0;
    }
}

.image-review {


    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    align-content: center;

    width: 100%;
    /* background-color: red; */
    height: 100%;

    overflow: hidden;
    overflow-x: auto;
    padding: 0;
    margin: 0;
    margin-top: 20px;
}

.image-review img {
    margin: 5px;

    border-radius: 6px;
}


.image-area {
    position: relative;

    font-weight: 500;
    height: 300px;
    transition: all 100ms ease-in-out;
}

.image-area:hover {
    color: #BB2D1B
}

.image-area:hover img {
    transform: scale(1.02);
    transition: all 100ms ease-in-out;
}
</style>