<template>
    <div style="position: relative; display: flex; flex-direction: row; align-items: center;">


        <div v-if="score!=null"
            style="height: 50px; letter-spacing: .5px; font-weight: 500; font-size: 17px; border-radius: 12px; width: fit-content; background-color: #EAEAEA; margin-right: 10px; display: flex; flex-direction: row; align-items: center; padding-left: 25px; padding-right: 25px;">
            <i class="fa-solid fa-trophy" style="font-size: 18px; color: #505050" /> <span
                style="margin-left: 15px; color: #505050">SCORE:</span>
            <span style="font-weight: 700; margin-left: 10px;">{{score}} Points</span>
        </div>
        <div
            style="height: 50px; letter-spacing: .5px; font-weight: 500; font-size: 17px; border-radius: 12px; width: fit-content; background-color: #EAEAEA; margin-right: 10px; display: flex; flex-direction: row; align-items: center; padding-left: 25px; padding-right: 25px;">
            <i class="fa-solid fa-eye" style="font-size: 18px; color: #505050" /> <span
                style="margin-left: 15px; color: #505050">VISIBILITY:</span>
            <span style="font-weight: 700; margin-left: 10px;">{{place.visibility.toFixed(2)}}%</span>
        </div>

        <div
            style="height: 50px;  letter-spacing: .5px; font-weight: 500; font-size: 17px; border-radius: 12px; width: fit-content; background-color: #EAEAEA;  display: flex; flex-direction: row; align-items: center; padding-left: 25px; padding-right: 25px;">
            <i class="fa-solid fa-route" style="font-size: 20px; color: #505050" /> <span
                style="margin-left: 15px; color: #505050">DISTANCE:</span>
            <span style="font-weight: 700; margin-left: 10px;">{{distanceKm}} km</span>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { getDistance } from 'geolib';
import { computed } from 'vue';



const props=defineProps<{
    place: any;
    score?: number
}>();


const distanceKm=computed(() => {
    return (getDistance({ lat: props.place.latitude, lng: props.place.longitude }, props.place.guess)/1000).toFixed(2);
});

const distanceMi=computed(() => {
    return (getDistance({ lat: props.place.latitude, lng: props.place.longitude }, props.place.guess)/1609.34).toFixed(2);
});

props.place;
</script>