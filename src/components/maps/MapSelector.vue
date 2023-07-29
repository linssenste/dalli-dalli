<template>
    <div class="map-area" data-testid="selection-area" @mouseenter="mapFocusEvent(true)" @mouseleave="mapFocusEvent(false)">




        <!-- Country hint button -->
        <div v-on:click="data.places[roundId].hint=true" class="country-hint-button" data-testid="country-hint-button"
            :class="{ 'country-hint-button-active': data.places[roundId].hint }">
            <span v-if="data.places[roundId].hint==false">
                <i class="fa-solid fa-flag"></i>Reveal
                flag </span>
            <div v-else class="country-flag"><span> Country:</span><img preload draggable="false"
                    :src="`http://purecatamphetamine.github.io/country-flag-icons/3x2/${data.places[roundId].countryId}.svg`" />
            </div>
        </div>



        <GoogleMap data-testid="selection-map" :fullscreen-control="false" :street-view-control="false"
            :zoom-control="false" map-type-id="roadmap" :map-type-control="false" :api-key="apiKey" class="map"
            :center="{ lat: 0, lng: 0 }" :zoom="2" @click="setMarker" :styles="minimal">
            <template #default="{ ready }">
                <Marker v-if="location&&ready" data-testid="selection-map-marker"
                    :options="{ position: location, icon: markerIcon() }" />
            </template>
        </GoogleMap>



        <!-- submit guess button -->
        <button data-testid="guess-button" v-on:click="submitData" :class="{ 'disabled-button': location===null }"
            class="submit-button action-button">
            <i class="fa-solid fa-check" />Submit Guess
        </button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { minimal } from "vue3-google-map/themes";


interface Location {
    lat: number,
    lng: number
}
let location=ref<Location|null>(null);
const apiKey=import.meta.env.VITE_API_KEY;

const props=defineProps<{
    roundId: number,
    data: any
}>();

props.roundId;
const markerIcon=() => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#BB2D1B',
    fillOpacity: 1,
    strokeColor: '#BB2D1B',
    scale: 8   // Adjust the scale to change the size of the circle
});



const emit=defineEmits(['focus', 'submit'])


function mapFocusEvent(isHovering: boolean): void {
    emit('focus', isHovering);
}

function submitData(e: MouseEvent): void {
    if (location.value===null) return;
    e.stopImmediatePropagation();
    e.preventDefault()

    emit('submit', location.value);
}
function setMarker(event: any) {
    location.value={ lat: event.latLng.lat(), lng: event.latLng.lng() };

    try {

        event.stopImmediatePropagation();
        event.preventDefault();
    } catch (error) {
        return
    }
}
</script>

<style scoped>
.map {
    width: 100%;
    height: 100%;
    cursor: pointer !important;
}

.map-area {
    position: relative;
    width: 100%;
    overflow: hidden;
    height: 100%;


}


.submit-button {
    position: absolute;
    bottom: 30px;
    width: calc(100% - 20px);
    left: 50%;
    transform: translateX(-50%);

}



.disabled-button {
    opacity: 11;
    backdrop-filter: blur(5px) !important;
    /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(5px) !important;
    background-color: #C0C0C0aa;
    /* pointer-events: none !important; */
    z-index: 50
}

.disabled-button:hover {
    background-color: #C0C0C0aa;
    cursor: not-allowed;
}




.country-hint-button-active {
    backdrop-filter: blur(10px);
    /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(10px);
    color: #303030;
    cursor: default !important;
    transition: all 0.2s ease-in-out;
    pointer-events: none;
}

.country-hint-button {
    position: absolute;
    top: 15px;
    right: 15px;
    z-index: 1;


    height: 50px;
    width: 220px;
    letter-spacing: .5px;
    background-color: #F0F0F0AA;
    backdrop-filter: blur(5px);
    /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(5px);
    border-radius: 25px;
    color: #303030;
    font-weight: 500;
    font-size: 17px;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;

    /* box-shadow: 2px 2px 15px 2px #00000022; */
    transition: all 0.2s ease-in-out;
}

.country-hint-button i {
    margin-right: 10px;
    font-size: 17px;
}

.country-hint-button:hover {
    background-color: #F0F0F0CC;
    /* box-shadow: 2px 2px 15px 2px #00000022; */

    color: #303030;
    transition: all 0.2s ease-in-out;
}

.country-hint-button:hover i {
    color: #BB2D1B;
    transition: all 0.2s ease-in-out;
}

.country-flag {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}

.country-flag img {
    margin-left: 15px;
    aspect-ratio: 3/2;
    background-color: #e0e0e0;
    width: 40px;
    border-radius: 4px;
}
</style>
