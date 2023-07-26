<template>
    <GoogleMap ref="mapRef" :fullscreen-control="false" :street-view-control="false" :zoom-control="false"
        :map-type-control="false" :api-key="apiKey" style="width: 100%; height: 100%;" :zoom="2">
        <template #default="{ ready }">
            <!-- <Circle v-if="ready" :options="circle" /> -->
            <Marker v-if="ready" v-for="location in locations"
                :options="{ position: { lat: location[0], lng: location[1] }, }" />
        </template>
    </GoogleMap>
</template>


<script lang="ts" setup>
import { ref } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
const apiKey=import.meta.env.VITE_API_KEY;




const props=defineProps<{
    locations: [number, number][];
}>();

props.locations;



const mapRef=ref(null);
// onMounted(() => {
//     watch(() => mapRef.value.ready, (isReady) => {

//         if (!isReady) return;
//         const gmap=mapRef.value.map;
//         fitBounds()

//     });


// });

</script>