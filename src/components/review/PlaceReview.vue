<template>
    <div class="review-area">
        <div class="image-wrapper">

            <StreetViewReview v-if="data.settings.difficulty==3" class="image-area" data-testid="street-view-review"
                :config="{ ...data.places[roundId].pov, lat: data.places[roundId].lat, lng: data.places[roundId].lng }" />
            <ImageReview v-else :place="data.places[roundId]" data-testid="image-review" />

        </div>
        <div class="round-info-column">

            <div class="round-stats">
                <PointsRoundChart class="chart-stats" :score="data.places[roundId].score" data-testid="chart-stat" />
                <RoundStats class="round-stats-cards" :place="data.places[roundId]" data-testid="card-stats" />
            </div>

            <DistanceMap class="round-distance-map" data-testid="guess-distance-map"
                :location="{ lat: parseFloat(data.places[roundId].lat), lng: parseFloat(data.places[roundId].lng) }"
                :guess="data.places[roundId].guess" />

            <!-- next button -->
            <button class="next-button action-button" v-on:click="nextRound()" data-testid="next-round-button">
                <span v-if="roundId<4">Play Round {{roundId+2}}</span>
                <span v-else>Game Overview</span><i class="fa-solid fa-arrow-right" />
            </button>

        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';

import 'vue-image-zoomer/dist/style.css';
import DistanceMap from '../maps/DistanceMap.vue';
import RoundStats from './RoundStats.vue';
import StreetViewReview from '../maps/StreetViewReview.vue';
import ImageReview from './ImageReview.vue';
import { getDistance } from 'geolib';
import PointsRoundChart from './PointsRoundChart.vue';


const props=defineProps<{
    data: any,
    roundId: number,
}>();

const emit=defineEmits(['continue']);

onMounted(() => {
    props.data.places[props.roundId].distance=(getDistance({ lat: props.data.places[props.roundId].lat, lng: props.data.places[props.roundId].lng }, props.data.places[props.roundId].guess)/1000).toFixed(2);
    props.data.places[props.roundId].score=calculateScore(props.data.places[props.roundId].visibility, props.data.places[props.roundId].distance);
})

function calculateScore(visibility: number, distance: number): number {
    // Set base score constants
    const baseD_score=4000;
    const baseV_score=1000;

    let D_score=0;
    let V_score=0;

    // Calculate distance score using an exponential decay function
    // The decay rate is set to -0.004, such that D_score becomes close to 0 after around 1000km
    D_score=baseD_score*Math.exp(-0.006*distance);

    // Calculate visibility score as a linear function
    // This will yield a score from 0 to 1000 depending on visibility, higher score for less visibility
    V_score=baseV_score*(1-(visibility/100));

    // Ensure the scores don't go below zero
    D_score=Math.max(D_score, 0);
    V_score=Math.max(V_score, 0);

    if (D_score<10) return 0;
    // Calculate total score
    let totalScore=D_score+V_score;

    if (visibility<2&&distance<.5) return 5000
    // Round to the nearest integer
    return Math.round(totalScore);
}

function nextRound(): void {
    emit('continue');
}

// const emit=defineEmits(['next'])

props.data;
props.roundId;
</script>

<style scoped>
.review-area {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
}


@media screen and (max-width: 1000px) {
    .review-area {
        flex-direction: column;
    }
}


.image-wrapper {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: calc(100% - 600px);
    height: 100%;
    position: relative;

}

@media screen and (max-width: 1000px) {
    .image-wrapper {
        height: 50%;
        max-width: 100%;

    }

}

@media screen and (max-width: 1000px) {
    .image-wrapper {
        max-width: 100%;
    }

}


.chart-stats {
    max-width: calc(100% - 20px);
    position: relative;
    margin: 10px;
}

.image-area {
    flex-grow: 1;
}

.round-stats {
    position: absolute;
    top: 0px;
    z-index: 100;
    width: 100%;


    height: 120px;

}

.round-info-column {
    max-width: 600px;
    width: 100%;
    height: 100%;
    position: relative;
}

@media screen and (max-width: 1000px) {
    .round-info-column {
        max-width: 100%;
    }
}

.round-stats-cards {
    top: 0px;
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

.round-distance-map {
    width: 100%;
    height: 100%
}


.next-button {
    position: absolute;
    bottom: 25px;
    right: 15px;
    width: 250px;
    margin: 2px;
}
</style>
