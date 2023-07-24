<template>
    <div style="position: relative; height: 100%; width: 100%">
        <!-- {{config}} -->

        <img v-if="snapshot" :src="image"
            style="height: 100%; width: 100%; max-width: 600px; max-height: 600px; object-fit: contain; margin: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" />
        <div v-else ref="streetView"
            style="width: 100%; height:100%; margin: auto; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        </div>

    </div>
</template>

<script lang="ts" setup>
/// <reference types="google.maps" />

import { ref, onMounted, watch, nextTick } from 'vue';

const snapshot=ref(false)
const props=defineProps<{
    image: string,
    config: {
        latitude: number,
        longitude: number,
        heading?: number,
        pitch?: number,
        fov?: number
    },
}>()

props.config;
props.image;
const streetView=ref(null);

watch(snapshot, async () => {
    if (snapshot.value==true) return;
    await nextTick()
    const panorama=new google.maps.StreetViewPanorama(streetView.value, {
        position: { lat: props.config.latitude, lng: props.config.longitude },
    });
    panorama.setPov({
        heading: props.config.heading||0,
        pitch: props.config.pitch||0,
        // fov: props.config.fov||90
    });

    // Add a slight delay before setting the heading
    setTimeout(() => {
        panorama.setPov({
            heading: props.config.heading||0,
            pitch: props.config.pitch||0
        });
    }, 500);
}, { immediate: true });

</script>
