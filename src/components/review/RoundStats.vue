<template>
    <div class="stats-row">
        <div v-if="score!=null" style="min-width: 210px; padding-right: 10px; margin-right: 10px; margin-left: 10px;"
            class="info-card" data-testid="score-card">
            <i class="fa-solid fa-trophy" />
            <span>SCORE:</span>
            <span class="info-card-value">{{score}} Points</span>
        </div>

        <div class="info-card" style="margin-right: 10px; margin-left: 10px;" data-testid="visibility-card">
            <i class="fa-solid fa-eye" />
            <span>VISIBILITY:</span>
            <span class="info-card-value">{{formattedVisibility}}%</span>
        </div>

        <div class="info-card" style="min-width: 215px; margin-left: 10px; " data-testid="distance-card">
            <i class="fa-solid fa-route" />
            <span>DISTANCE:</span>
            <div class="info-card-value">{{formattedDistance}} {{distanceUnit}}</div>
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
    background-color: #F0F0F0CC;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    padding-left: 25px;
    padding-right: 25px;
    color: #303030 !important;
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
