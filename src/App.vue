<template>
    <!-- <div v-if="isIncompatible"
        style="padding: 20px; padding-top: 50px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <img draggable="false" class="logo" src="./assets/game-logo.webp" width="300" height="112" />

        <div style="font-size: 18px; color: black!important; font-weight: 500; max-width: 500px; margin-top: 30px;">Sorry,
            this game is designed for
            Desktop
            computers. But I'm working on it!
        </div>

    </div> -->
    <div class="geo-dalli-area">

        <!-- game settings if new game and not configures -->
        <div v-if="mode===0&&!isConfigured" class="game-settings-overlay" data-testid="game-settings-area">
            <GameSettings v-on:start="startGame" />
        </div>

        <!-- running game mode -->
        <div v-else-if="mode===0" class="game-mode">

            <!-- loading screen -->
            <div v-if="!imageLoaded" class="loading-overlay" data-testid="game-loading-overlay">
                <LoadingAnimation />
            </div>


            <!-- dalli game for image -->
            <DalliKlick v-if="places[currentIndex]!=null" class="game-image" data-testid="game-image-area"
                v-on:loaded="imageLoaded=true" v-on:update="visibilityPercentage=$event" v-bind:image="dalliImage" />

            <!-- map for guessing location -->
            <MapSelector v-if="places[currentIndex]!=null" :roundId="currentIndex" class="game-map"
                data-testid="game-map-area" v-on:submit="submitEvent" />

        </div>

        <!-- round review  -->
        <PlaceReview v-else-if="mode==1&&currentIndex>=0" data-testid="round-review-view" :visibility="visibilityPercentage"
            :location="inputPlaceGuess" :key="currentIndex" :roundId="currentIndex" v-on:next="nextRound()"
            :imageId="imageId||0" :data="places[currentIndex]">
        </PlaceReview>


        <!-- overall game review -->
        <GameReview v-else-if="mode===2" :places="places" data-testid="game-review-view" />


    </div>
</template>

<script lang="ts" setup>
import { ref, nextTick, computed } from 'vue';
import { store } from './store';

import DalliKlick from './components/DalliKlick.vue';
import MapSelector from './components/maps/MapSelector.vue';

import GameSettings from './components/settings/GameSettings.vue';

import GameReview from './components/review/GameReview.vue';
import PlaceReview from './components/review/PlaceReview.vue';

import LoadingAnimation from './components/LoadingAnimation.vue';
import axios from 'axios';

interface Location {
    lat: number,
    lng: number
}


const places=ref<any>([]);
const inputPlaceGuess=ref<null|Location>(null);

const imageLoaded=ref(false)
const visibilityPercentage=ref(0);
let currentIndex=ref(-1);
const mode=ref(0)



const isConfigured=computed(() => store.state.settings.configured)

const imageId=computed(() => {

    if (store.state.settings.difficulty!==3&&places.value!=null&&places.value.length>0&&places.value[currentIndex.value]!=null) {
        return Math.floor(Math.random()*(places.value[currentIndex.value].images.length-1));
    }
    return 0;
})


const isIncompatible=computed(() => {
    return !(window.innerWidth>window.innerHeight&&window.innerWidth>1000)
})

const dalliImage=computed(() => {
    return store.state.settings.difficulty===3? places.value[currentIndex.value].image:places.value[currentIndex.value].images[imageId.value].src.original+'?auto=compress&cs=tinysrgb&h=1250';
})



async function startGame(): Promise<void> {

    store.commit('resetScore')

    if (store.state.settings.difficulty===3) await getRandomLocation();
    else await loadGamePlaces();


    await nextTick()

    currentIndex.value=0;
    mode.value=0;
    document.title=`GEODALLI - ${currentIndex.value+1}/5`;
}


async function submitEvent(location: Location): Promise<void> {
    inputPlaceGuess.value=location;

    if (inputPlaceGuess.value==null) {
        return;
    }

    places.value[currentIndex.value].imageId=imageId.value;
    places.value[currentIndex.value].guess=inputPlaceGuess.value;
    places.value[currentIndex.value].visibility=visibilityPercentage.value;

    await nextTick();
    mode.value=1;

}
function nextRound(): void {

    imageLoaded.value=false;
    if (currentIndex.value+1==5) {
        document.title=`GEODALLI - Game overview`;
        mode.value=2;
        return;
    }
    mode.value=0;
    currentIndex.value+=1
    document.title=`GEODALLI - ${currentIndex.value+1}/5`;

}


async function randomPlaces(places: any[], count: number): Promise<number[]> {

    let oldPlaces=JSON.parse(localStorage.getItem('places') as string||'[]');
    const module: any=await import('./assets/geo_images.json');

    let filteredPlaces: any=places.filter((place) => place.difficulty<=store.state.settings.difficulty);

    oldPlaces=oldPlaces.map((place: string) => places.reduce((a: any, b: any) => a.id==place? a:b).difficulty<=store.state.settings.difficulty? place:null).filter((place: any) => place!=null);

    if (oldPlaces.length+5>=filteredPlaces.length-1) {
        localStorage.setItem('places', JSON.stringify([]))
        oldPlaces=[];
    }

    filteredPlaces=filteredPlaces.filter((place: any) => !oldPlaces.includes(place.id));

    const indices: any[]=[];
    while (indices.length<count) {
        if (filteredPlaces.length<=0) {
            throw new Error("Not enough filtered places to provide the required count.");
        }
        const randomIndex=Math.floor(Math.random()*(filteredPlaces.length));
        const selectedPlace={ ...filteredPlaces[randomIndex], images: module.default[filteredPlaces[randomIndex].id] };
        if (!indices.find(place => place.id===selectedPlace.id)) {
            indices.push(selectedPlace);
        }
    }

    localStorage.setItem('places', JSON.stringify([...oldPlaces, ...indices.map(p => p.id)]))

    return indices;
}




function randomPositions(positions: any[], count: number): number[] {

    const indices: number[]=[];

    while (indices.length<count) {
        const randomIndex=Math.floor(Math.random()*(positions.length-1));

        if (!indices.includes(randomIndex)) {
            indices.push({ ...positions[randomIndex], images: [] });
        }
    }

    return indices;
}



const getRandomLocation=async () => {
    let resultingPosition=null;

    const module=await import('./assets/positions.json');



    let positions=randomPositions(module.default.pos, 5);
    let streetViewImagesPromise: any=[]
    positions.forEach((pos: any) => {
        try {
            resultingPosition=checkStreetView(pos[0], pos[1])

            if (resultingPosition!=null) {
                streetViewImagesPromise.push(resultingPosition)
            }

        } catch (error) {
            console.log(error)
        }
    })

    const res=await Promise.all(streetViewImagesPromise);

    places.value=res.map((posImg, index) => ({ image: posImg.url, config: posImg, latitude: positions[index][0], longitude: positions[index][1] }))

}

const checkStreetView=async (lat: string, lng: string) => {

    try {
        const heading=Math.floor(Math.random()*360);

        const pitch=15
        const response=await axios.get(`https://maps.googleapis.com/maps/api/streetview?size=1240x800&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&return_error_code=true&key=${import.meta.env.VITE_API_KEY}`, { responseType: 'blob' })

        if (response.status===200) {
            return {
                url: URL.createObjectURL(response.data), config: {
                    latitude: lat,
                    longitude: lng,
                    heading: heading,
                    pitch: pitch
                }
            }
        }
    } catch (error) {
        console.log(error)
    }


}

async function loadGamePlaces(): Promise<void> {
    try {

        const module=await import('./assets/geos.json');
        places.value=await randomPlaces(module.default.places, 5);


    } catch (error) {
        console.error('Failed to load places.json or get the image', error);
    }
}
</script>



<style scoped>
.game-image {
    width: 60%;
    max-width: calc(100% - 500px)
}


.game-map {
    position: relative;
    width: 40%;
    min-width: 500px;
    height: 100vh;
}

.game-mode {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: row;
}

.game-settings-overlay {
    overflow-x: hidden;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFFF0;
}

.geo-dalli-area {
    width: 100%;
    height: 100%;
    position: relative;
}

.loading-overlay {
    z-index: 100;
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: #FFFFFF;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>