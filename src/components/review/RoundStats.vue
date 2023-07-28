<template>
    <div class="stats-row">
        <div v-if="score!=null" class="info-card" data-testid="score-card">
            <i class="fa-solid fa-trophy" />
            <span>SCORE:</span>
            <span class="info-card-value">{{score}} Points</span>
        </div>

        <div class="info-card" data-testid="visibility-card">
            <i class="fa-solid fa-eye" />
            <span>VISIBILITY:</span>
            <span class="info-card-value">{{formattedVisibility}}%</span>
        </div>

        <div class="info-card" data-testid="distance-card">
            <i class="fa-solid fa-route" />
            <span>DISTANCE:</span>
            <span class="info-card-value">{{formattedDistance}} {{distanceUnit}}</span>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { getDistance } from 'geolib';
import { computed } from 'vue';

const props=defineProps<{
    place: any;
    score?: number,
    miles?: boolean,
}>();

const distanceKm=computed(() => {
    return (getDistance({ lat: props.place.lat, lng: props.place.lng }, props.place.guess)/1000);
});

const distanceMi=computed(() => {
    return (getDistance({ lat: props.place.lat, lng: props.place.lng }, props.place.guess)/1609.34);
});

const formattedVisibility=computed(() => {
    return props.place.visibility.toFixed(2);
});

const formattedDistance=computed(() => {
    const distance=props.miles? distanceMi.value:distanceKm.value;
    return distance.toFixed(distance>50? 0:2);
});

const distanceUnit=computed(() => {
    return props.miles? 'mi':'km';
});
</script>


<style scoped>
.stats-row {
    position: relative;
    display: flex;
    align-items: center;
}

.info-card-value {
    font-weight: 700;
    margin-left: 10px !important;
}

.info-card {
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    height: 50px;
    letter-spacing: .5px;
    font-weight: 500;
    font-size: 17px;
    border-radius: 10px;
    width: fit-content;
    background-color: #F0F0F0;
    display: flex;
    align-items: center;
    padding-left: 25px;
    padding-right: 25px;
}

.info-card i {
    font-size: 20px;
    color: #303030
}

.info-card span {
    margin-left: 15px;
    color: #303030
}
</style>
