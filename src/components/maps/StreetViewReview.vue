<template>
    <div ref="streetView" class="street-view-area" />
</template>

<script lang="ts" setup>
/// <reference types="google.maps" />

import { ref, onMounted } from 'vue';


const props=defineProps<{
    image: string,
    config: {
        lat: number,
        lng: number,
        heading?: number,
        pitch?: number,
        fov?: number
    },
}>()

props.config;
props.image;
const streetView=ref(null);

onMounted(async () => {

    const panorama=new google.maps.StreetViewPanorama(streetView.value, {
        position: { lat: props.config.lat, lng: props.config.lng },
    });
    panorama.setPov({
        heading: props.config.heading||0,
        pitch: props.config.pitch||0,
    });



})

</script>

<style scoped>
.street-view-area {
    width: 100%;
    height: 100%;
    position: relative;
}
</style>
