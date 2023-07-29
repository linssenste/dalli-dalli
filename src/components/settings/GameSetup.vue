<template>
    <div class="settings-area">


        <GameInformation v-if="!isMobile" />
        <div class="game-settings">
            <div
                style="width: 100%; position: relative; width: calc(100% - 16px); max-width: 450px;  margin: auto; padding: 8px; padding-bottom: 15px; padding-top: 15px;">

                <div v-if="isMobile" class="logo-container">
                    <img draggable="false" preload class="logo" src="../../assets/game-logo.webp" width="300"
                        height="112" />
                </div>

                <DifficultySettings v-on:change="updateSettingsEvent" />
                <ShapeSettings v-on:update="updateSettingsEvent" />

                <!-- start game button -->
                <button class="start-button action-button" @click="startGame()">
                    <i class="fa-solid fa-play "></i>
                    <div>Start Game</div>
                </button>
            </div>


        </div>
    </div>
</template>



<script lang="ts" setup>
import { onMounted, ref, computed, onUnmounted } from 'vue';
import ShapeSettings from './ShapeSettings.vue';
import DifficultySettings from './DifficultySettings.vue';
import axios from 'axios'
import GameInformation from './GameInformation.vue';

export interface LocationImage {
    alt?: string,
    id: number,
    photographer?: string,
    photographer_url?: string,
    src: string,
}

export interface GameLocation {
    name?: string,
    difficulty: number,
    type: 0|1,
    lat: number,
    lng: number,
    countryId: string;
    images?: LocationImage[],
    imageId?: number
    image?: string
}

export interface GameSettings {
    difficulty: number,
    terrain: number,
    type: string,
    shapes: number,
    interval: number
}


const emit=defineEmits(['start', 'loading'])
const windowWidth=ref(window.innerWidth);

const updateWidth=() => {
    windowWidth.value=window.innerWidth;
}

onMounted(() => {
    document.title=`GEODALLI`;
    window.addEventListener('resize', updateWidth);
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth);
});


const isMobile=computed(() => {
    return windowWidth.value<1000;
})

const settings=ref<GameSettings>({
    difficulty: 1,
    terrain: 1,
    type: 'voronoi',
    shapes: 1,
    interval: 0
})

function updateSettingsEvent(data: any) {
    settings.value={ ...settings.value, ...data }
}


function randomPositions(geolocations: [number, number, number, string][], count: number, terrain: number): GameLocation[] {

    const indices: Set<number>=new Set();

    const filtered=geolocations.filter((pos) => pos[2]<=terrain);
    while (indices.size<count) {
        const randomIndex=Math.floor(Math.random()*filtered.length);
        indices.add(randomIndex);
    }

    const positions=Array.from(indices).map(index => {
        return { lat: filtered[index][0], lng: filtered[index][1], difficulty: filtered[index][2], image: null, type: 1, countryId: filtered[index][3] };
    });

    return positions;
}




async function getRandomLocation(terrain: number): Promise<any> {

    const module=await import('../../assets/positions.json');

    let positions=randomPositions(module.default.pos, 5, terrain);

    let streetViewImagesPromise: any=[];

    let resultingPosition=null;
    positions.forEach((pos: any) => {
        try {
            resultingPosition=checkStreetView(pos.lat, pos.lng)

            if (resultingPosition!=null) {
                streetViewImagesPromise.push(resultingPosition)
            }

        } catch (error) {
            console.log(error)
        }
    })

    const res=await Promise.all(streetViewImagesPromise);


    return res.map((posImg, index) => ({ ...positions[index], ...posImg }))


}

const checkStreetView=async (lat: string, lng: string) => {

    try {
        const heading=Math.floor(Math.random()*360);

        const pitch=Math.floor(Math.random()*(20-10+1)+10)

        const response=await axios.get(`https://maps.googleapis.com/maps/api/streetview?size=640x450&fov=100&location=${lat},${lng}&heading=${heading}&pitch=${pitch}&key=${import.meta.env.VITE_API_KEY}`, { responseType: 'blob' })

        if (response.status===200) {
            return {
                image: URL.createObjectURL(response.data), pov: {
                    heading: heading,
                    pitch: pitch
                }
            }
        }
    } catch (error) {
        return null;
    }


}




async function loadPhotographyGame(difficulty: number): Promise<GameLocation[]> {


    const module=await import('../../assets/geos.json');
    return await randomPlaces(module.default.places, 5, difficulty);


}


async function randomPlaces(places: any[], count: number, difficulty: number): Promise<any[]> {

    const module: any=await import('../../assets/geo_images.json');

    // remove duplicates from the places array based on the id property
    const filteredPlaces=Array.from(new Set(places.map(place => place.id)))
        .map(id => places.find(place => place.id===id)).filter(place => place.difficulty<=difficulty);

    const indices: Set<number>=new Set();

    while (indices.size<count) {
        const randomIndex=Math.floor(Math.random()*filteredPlaces.length);
        indices.add(randomIndex);
    }

    const selectedPlaces=Array.from(indices).map(index => {
        return { ...filteredPlaces[index], imageId: Math.floor(Math.random()*module.default[filteredPlaces[index].id].length), images: module.default[filteredPlaces[index].id], type: 0 };
    });

    return selectedPlaces;
}




async function startGame(): Promise<void> {
    console.log(settings.value.terrain);
    emit('loading', true)

    try {
        let randomPlaces=[]
        const url=new URL(window.location.href);
        url.searchParams.set('interval', settings.value.interval.toString());
        url.searchParams.set('difficulty', settings.value.difficulty.toString());
        url.searchParams.set('shapes', settings.value.shapes.toString())
        url.searchParams.set('type', settings.value.type)
        url.searchParams.set('terrain', settings.value.terrain.toString())

        history.pushState({}, '', url.toString());
        if (settings.value.difficulty===3) randomPlaces=await getRandomLocation(settings.value.terrain);

        else randomPlaces=await loadPhotographyGame(settings.value.difficulty);
        setTimeout(() => {
            // emit('loading', false)


            emit('start', { places: randomPlaces.map((p) => ({ ...p, hint: false, visibility: 0, guess: { lat: null, lng: null } })), settings: settings.value })

        }, 500);
    } catch (error) {

    }
}



</script>


<style scoped>
.copyright-link {
    z-index: 100;
    position: absolute;
    top: -15px;
    right: 15px;
    font-weight: 500;
    color: #1a42ba;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;

}

.copyright-link:hover {
    transform: scale(1.01);
    transition: all 200ms ease-in-out;
}

.game-settings {

    position: relative;
    display: flex;
    /* padding: 5px; */
    flex-direction: column;
    justify-content: space-between;

    width: 50%;

    overflow-y: scroll;
    height: 100%;
    /* margin-top: 30px !important; */
}

@media screen and (max-width: 1000px) {
    .game-settings {
        width: 100%;
        height: 100%;
    }

}

.start-button {
    width: 100%;

    margin-top: 30px !important
}


.settings-area {
    display: flex;
    user-select: none;
    flex-direction: row;
    position: relative;
    align-items: start;
    width: 100%;
    min-height: 100%;
    justify-content: start;
    overflow: auto;
    /* Enable scroll if necessary */
}


@media screen and (max-width: 1000px) {
    .settings-area {
        flex-direction: column;
        justify-content: center;

    }
}

.logo-container {
    /* position: absolute; */
    /* top: 0px;
    left: calc(50%);
    transform: translateX(-50%); */

    margin-bottom: 30px;
    font-size: 30px;
    text-transform: uppercase;
    line-height: 30px;
}
</style>