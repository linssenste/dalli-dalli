<template>
    <div style="overflow: hidden; position: relative;">

        <!-- map + score counter -->
        <div class="score-map-area" :id="reviewIndex==-1? 'honeycomb':''">

            <!-- round map review (distance between points) -->
            <DistanceMap v-if="data.places!=null&&reviewIndex>=0&&reviewIndex<5" class="round-map"
                :location="{ lat: parseFloat(data.places[reviewIndex].lat), lng: parseFloat(data.places[reviewIndex].lng) }"
                :guess="data.places[reviewIndex].guess" />

            <!-- score counter/landing view -->
            <div v-else class="overview-text">

                <ConfettiExplosion class="hidden-confetti" v-if="showConfetti" />

                <img v-if="!isMobile" draggable="false" style="margin-bottom: 15px; margin-top: 12px;" class="logo"
                    src="../../assets/game-logo.webp" width="275" height="102" />

                <div id="value" :style="isMobile? 'margin-top: 90px':''"
                    style="font-size: 100px; color: #BB2D1B;  height: 125px; font-weight: 700; z-index: 100">
                    {{totalScore}}
                </div>
                <div
                    style="font-size: 20px;text-transform: uppercase; z-index: 10000; letter-spacing: 1px; font-weight: 500; color: black">
                    POINTS</div>


                <div class="fade-border">
                </div>
            </div>

            <button v-on:click.stop.prevent="newGameEvent()" class="new-game-button action-button">

                <i class="fa-solid fa-arrow-rotate-left" />Play again
            </button>

            <button v-if="reviewIndex!=-1" v-on:click.stop.prevent="reviewIndex=-1" class="icon-button close-button"><i
                    class="fa-solid fa-xmark" /></button>

        </div>



        <div v-if="!isMobile"
            style="position: relative;display: flex;  height: 50px; flex-direction: row; justify-content: space-between; align-items: center;  margin: 30px; margin-top: 20px; margin-bottom: 20px;">
            <div style="font-size: 25px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                <span v-if="reviewIndex==-1" style="margin: 0 auto">Game Breakdown</span>


                <span v-else>Round {{reviewIndex+1}}</span>
            </div>
            <span v-if="reviewIndex==-1&&!isMobile"
                style="font-family: 'biro_script_standardregular'; font-size: 30px;">{{gamePhrase}}</span>

            <RoundStats v-else-if="data.places!=null&&reviewIndex>=0&&reviewIndex<5" :score="data.places[reviewIndex].score"
                :place="data.places[reviewIndex]" />


        </div>

        <RoundStats v-else-if="data.places!=null&&reviewIndex>=0&&reviewIndex<5" :score="data.places[reviewIndex].score"
            :place="data.places[reviewIndex]" class="detail-stats" />

        <PointsBreakdownChart :data="data" :roundId="reviewIndex" v-on:selected="reviewIndex=$event" />

        <div v-if="data.places!=null" class="image-review">
            <div v-for="(place, index) in data.places" class="image-area" :id="`preview-image-${index}`">
                <!-- {{place}} -->
                <div :style="reviewIndex==index? 'color: #303030!important; font-weight: 600;':''"
                    style="position: relative;height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">


                    <img v-on:click.stop.prevent="choosePreviewImage(index)" draggable="false"
                        :height="reviewIndex==index? 150:130" style="transition: all 150ms linear;"
                        :src="data.settings.difficulty===3? place.image:place.images[place.imageId].src+'?auto=compress&cs=tinysrgb&h=300'" />
                    <div :style="`opacity: ${reviewIndex==index? 1:0}; width: ${reviewIndex==index? 200:120};`"
                        class="place-name"><span v-if="place.name!=null">{{place.name}}
                        </span><span v-else>ROUND {{index+1
                        }}</span></div>
                </div>
            </div>


        </div>

    </div>
</template>


<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';

import DistanceMap from '../maps/DistanceMap.vue';
import PointsBreakdownChart from './PointsBreakdownChart.vue';
import RoundStats from './RoundStats.vue';
import ConfettiExplosion from "vue-confetti-explosion";
import { GameLocation, GameSettings } from '../settings/GameSetup.vue';
import { perfectScorePhrases, highScorePhrases, midScorePhrases, lowScorePhrases, minScorePhrases } from '../../plugins/handwork';
const props=defineProps<{
    data: {
        places: GameLocation[],
        settings: GameSettings
    },
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
const totalScore=computed(() => {
    let score=0;
    for (let i=0; i<props.data.places.length; i++) {
        score+=props.data.places[i].score;
    }
    return score;
});

const gamePhrase=ref('Good job!');
const windowWidth=ref(window.innerWidth);

const updateWidth=() => {
    windowWidth.value=window.innerWidth;
}



onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});


const isMobile=computed(() => {
    return windowWidth.value<1000;
})


onMounted(() => {
    window.addEventListener('resize', updateWidth);
    gamePhrase.value=generatePhrase(totalScore.value);

    const obj=document.getElementById("value");






    animateValue(obj, 0, totalScore.value, 1500);
    if (totalScore.value>=20000) {


        setTimeout(() => {
            showConfetti.value=true;
            setTimeout(() => {
                showConfetti.value=false;
            }, 5000);
        }, 1550);
    }
})



function choosePreviewImage(index: number) {


    const resultingIndex=reviewIndex.value!=index? reviewIndex.value=index:reviewIndex.value=-1;

    if (resultingIndex!=-1) {
        const doc=document.getElementById(`preview-image-${index}`);
        if (doc) doc.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}
function generatePhrase(score: number): string {

    let phrases;

    if (score>=25000) {
        phrases=perfectScorePhrases;
    } else if (score>=20000) {
        phrases=highScorePhrases;
    } else if (score>=15000) {
        phrases=midScorePhrases;
    } else if (score>=5000) {
        phrases=lowScorePhrases;
    } else {
        phrases=minScorePhrases;
    }

    const randomIndex=Math.floor(Math.random()*phrases.length);
    return phrases[randomIndex];
}




props.data;
</script>


<style scoped lang="scss">
.hidden-confetti {
    position: absolute;
    top: 50%;
    height: 10px;
    width: 10px;
    background-color: red;

}

.detail-stats {
    flex-wrap: nowrap;
    width: 100%;
    overflow-x: auto !important;
    display: flex;
    flex-direction: row;
    margin-top: 5px;
    height: 70px;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0px;

    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}



.round-map {
    width: 100%;
    height: 100%;
    position: relative;
}

.score-map-area {
    width: 100%;
    height: 320px !important;
    position: relative;
}

.close-button {
    position: absolute;
    top: 15px;
    left: 15px;
    z-index: 100
}

.new-game-button {
    box-shadow: 2px 2px 15px 2px #00000033;
    position: absolute;
    top: 15px;
    right: 15px;

    z-index: 100;

}

.new-game-button:hover {
    transform: scale(1.01);
}

.new-game-button:hover i {
    transform: rotate(-360deg);
    transition: all 750ms;
}

.place-name {
    color: #505050;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    user-select: none;

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

    justify-content: center;
    align-items: start;


    max-width: 100%;
    /* background-color: red; */
    height: 100%;

    overflow: hidden;
    overflow-x: auto;
    margin-top: 10px;

    /* Hide scrollbar for Chrome, Safari and Opera */
    ::-webkit-scrollbar {
        display: none;
    }

    /* Hide scrollbar for IE, Edge and Firefox */
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

@media screen and (max-width: 800px) {
    .image-review {
        justify-content: start;
    }
}

.image-review img {
    margin: 5px;
    border-radius: 6px;
}

.image-review:first-child {
    margin-left: 0px !important;
}

.image-review img:not(:last-child) {
    margin-right: 10px;
}


.image-area {
    position: relative;

    font-weight: 500 !important;
    // height: 280px;
    transition: all 100ms ease-in-out;
}

.image-area:hover div {
    transition: all 100ms ease-in-out;
}

.image-area:hover {
    color: #BB2D1B
}

.image-area img {
    cursor: pointer;
}

.image-area:hover img:hover {
    opacity: 1 !important;
    transform: scale(1.02);
    transition: all 100ms ease-in-out;
}
</style>