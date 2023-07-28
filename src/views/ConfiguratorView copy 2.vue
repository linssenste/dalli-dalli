<template>
    <div style="width: 100%; height: 100%; position: relative; background-color: red;">
        <img :src="currentImage" width="600" style=" object-fit: cover;" />

        <DistanceMap style="width: 500px; height: 300px" v-if="currentIndex>=0"
            :location="{ lat: locations[currentIndex][0], lng: locations[currentIndex][1] }"
            :guess="{ lat: locations[currentIndex][0]+0.05, lng: locations[currentIndex][1] }" />
        <br />
        <button @click="nextImage">Decline</button>
        <button @click="acceptImage(1)">1</button>
        <button @click="acceptImage(2)">2</button>
        <button @click="acceptImage(3)">3</button>
        <button @click="printData" style="margin-left: 20px;">print</button>
        {{currentIndex}}/ {{locations.length}}
        <!-- <CoverageMap :locations="locations" /> -->
    </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";
import DistanceMap from "../components/maps/DistanceMap.vue";
let currentIndex=ref(-1);
let images=ref([]);
let acceptedLocations=ref([]);

let currentImage=ref(null);
const locations=ref([]);
onMounted(async () => {
    const module=await import('../assets/positions.json');
    locations.value=module.default.pos;
    console.log(module.default.pos.filter(p => p[2]===1));
    console.log(module.default.pos.filter(p => p[2]===2).length);
    console.log(module.default.pos.filter(p => p[2]===3).length);
    // const googleApiKey=import.meta.env.VITE_API_KEY;
    // const overpassApiUrl="https://overpass-api.de/api/interpreter";

    // let imageUrls;
    // do {
    //     const { lat, lon }=await generateRandomCoordinates();
    //     const delta=Math.floor(Math.random()*10);

    //     const bbox=generateBoundingBox({ lat, lon }, delta);

    //     imageUrls=await getAttractionsWithPhotos(bbox, overpassApiUrl, googleApiKey);
    // } while (!imageUrls||imageUrls.length===0);

    // images.value=imageUrls;
    // currentImage.value=images.value[currentIndex.value].url;
});

function acceptImage(difficulty: number) {
    acceptedLocations.value.push([...locations.value[currentIndex.value], difficulty]);
    nextImage();
}
function printData() {
    console.log(acceptedLocations.value);
    console.log(JSON.stringify(acceptedLocations.value));
}

const nextImage=() => {

    currentIndex.value+=1;
    streetView()
}



function shuffleArray<T>(array: T[]): T[] {
    let currentIndex=array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex!==0) {
        // Pick a remaining element...
        randomIndex=Math.floor(Math.random()*currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]]=[
            array[randomIndex],
            array[currentIndex],
        ];
    }

    return array.sort(() => 0.5-Math.random());
}
async function streetView() {

    const googleStreetViewUrl=`https://maps.googleapis.com/maps/api/streetview?size=600x300&location=${locations.value[currentIndex.value][0]},${locations.value[currentIndex.value][1]}&return_error_code=true&pitch=10&heading=${Math.floor(Math.random()*360)}&key=${import.meta.env.VITE_API_KEY}`;
    try {
        const googleResponse=await axios.get(googleStreetViewUrl, { responseType: 'blob' });
        if (googleResponse.status===200) {
            currentImage.value=URL.createObjectURL(googleResponse.data)
        }
    } catch (error) {
        console.error(error);
    }



}
</script>
