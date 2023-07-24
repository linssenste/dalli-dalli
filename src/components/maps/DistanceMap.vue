<template>
    <GoogleMap ref="mapRef" :fullscreen-control="false" :street-view-control="false" :zoom-control="false"
        :map-type-control="false" :api-key="apiKey" class="map" :zoom="16" @ready="fitBounds">
        <template #default="{ ready }">
            <Polyline v-if="ready" :options="path" />
            <!-- <Circle v-if="ready" :options="circle" /> -->
            <Marker v-if="ready" :options="{ position: location, icon: locationMarkerIcon() }" />
            <Marker v-if="ready" :options="{ position: guess, icon: markerIcon() }" />
        </template>
    </GoogleMap>
</template>


<script lang="ts" setup>
import { onMounted, watch, computed, ref } from 'vue';
import { GoogleMap, Marker, Polyline, Circle } from 'vue3-google-map';
const apiKey=import.meta.env.VITE_API_KEY;


const locationMarkerIcon=() => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#303030',
    fillOpacity: 1,
    strokeColor: '#303030',
    scale: 6   // Adjust the scale to change the size of the circle
});


const markerIcon=() => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#BB2D1B',
    fillOpacity: 1,
    strokeColor: '#BB2D1B',
    scale: 6   // Adjust the scale to change the size of the circle
});

const props=defineProps<{
    location: {
        lat: number,
        lng: number
    },
    guess: {
        lat: number,
        lng: number
    }
}>();

props.location;
props.guess;


const mapRef=ref(null);
onMounted(() => {
    watch(() => mapRef.value.ready, (isReady) => {

        if (!isReady) return;
        const gmap=mapRef.value.map;
        fitBounds()

    });


});

watch(() => props.location, () => {
    fitBounds()
});


const fitBounds=() => {

    const gmap=mapRef.value.map;
    const api=mapRef.value.api;
    const bounds=new api.LatLngBounds();
    bounds.extend(props.location);
    bounds.extend(props.guess);
    gmap.fitBounds(bounds);
};


const path=computed(() => {
    return {
        path: [props.location, props.guess],
        geodesic: false,
        strokeColor: "#303030",
        strokeOpacity: .75,
        strokeWeight: 3,
    };
});

const circle=computed(() => {
    return {
        center: props.location,
        radius: 500,
        strokeColor: "#CC2029",
        strokeOpacity: 1.0,
        strokeWeight: 4,
        fillColor: "#CC2029",
        fillOpacity: 0.35,
    }
})
</script>