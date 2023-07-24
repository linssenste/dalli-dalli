<template>
    <div class="map-area" data-testid="selection-area" @mouseenter="mapFocusEvent(true)" @mouseleave="mapFocusEvent(false)">

        <div class="info-text">
            <div>
                <img v-if="difficultyMode===3" style="position: absolute; top: 50%; transform: translateY(-50%);"
                    src="../../assets/rainbolt_smiley.png" width="20" />
                <div v-else>
                    <i class="fa-solid fa-star"></i>
                    <i v-if="difficultyMode>=1" class="fa-solid fa-star"></i>
                    <i v-else class="fa-regular fa-star"></i>
                    <i v-if="difficultyMode>=2" class="fa-solid fa-star"></i>
                    <i v-else class="fa-regular fa-star"></i>
                </div>
            </div>




            <div>

                <span style="margin-right: 10px; font-weight: 500;">{{roundId+1}} / 5</span>

                <span style="color: #BB2D1B; margin-left: 10px;"><span
                        style="margin-right: 10px; font-weight: 500;">SCORE:</span><b>
                        {{store.state.score}}</b></span>
            </div>
        </div>
        <GoogleMap data-testid="selection-map" :fullscreen-control="false" :street-view-control="false"
            :zoom-control="false" map-type-id="roadmap" :map-type-control="false"
            api-key="AIzaSyB0M8MjdeBfrP3ODrpffvMV2kU_ono4e0w" class="map" :center="{ lat: 48, lng: 11 }" :zoom="2"
            @click="setMarker" :styles="minimal">
            <template #default="{ ready }">
                <Marker v-if="location&&ready" data-testid="selection-map-marker"
                    :options="{ position: location, icon: markerIcon() }" />
            </template>
        </GoogleMap>

        <button data-testid="guess-button" v-on:click="submitData" :class="{ 'disabled-button': location===null }"
            class="submit-button">
            <i class="fa-solid fa-check" />Submit Guess
        </button>
    </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { GoogleMap, Marker } from 'vue3-google-map';
import { minimal } from "vue3-google-map/themes";
import { store } from '../../store';

interface Location {
    lat: number,
    lng: number
}
let location=ref<Location|null>(null);

const props=defineProps<{
    roundId: number
}>();
props.roundId;
const markerIcon=() => ({
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: '#BB2D1B',
    fillOpacity: 1,
    strokeColor: '#BB2D1B',
    scale: 8   // Adjust the scale to change the size of the circle
});

const difficultyMode=computed(() => store.state.settings.difficulty);

const emit=defineEmits(['focus', 'submit'])

function mapFocusEvent(isHovering: boolean): void {
    emit('focus', isHovering);
}

function submitData(e: MouseEvent): void {
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
.info-text {
    position: absolute;
    top: 15px;
    right: 15px;
    padding-left: 20px;
    border-radius: 12px;
    padding-right: 20px;
    background-color: #FAFAFACC;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    min-width: 300px;
    height: 50px;
    z-index: 10;

    /* Add the backdrop filter */
    backdrop-filter: blur(10px);
    /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(10px);
    /* For compatibility with some browsers */
}

.info-text i {
    font-size: 20px;
    margin: 2px;
    color: #F8DA5F;
}

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
    width: calc(100% - 60px);
    left: 50%;
    transform: translateX(-50%);
    height: 50px;
    background-color: #BB2D1BCC;
    border: none;
    margin: 2px;
    color: white;
    font-weight: 700;

    border-radius: 25px;
    height: 50px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border: none !important
}

.submit-button i {
    margin-right: 10px;
    font-size: 18px;
    border: none !important
}

.submit-button:hover {
    background-color: #BB2D1B;
    cursor: pointer;
}

.disabled-button {
    opacity: 0.5;
    background-color: #C0C0C0;
    /* pointer-events: none !important; */
    z-index: 50
}

.disabled-button:hover {
    background-color: #C0C0C0 !important;
    cursor: not-allowed;
}
</style>
