<template>
    <div>
        <img v-if="currentImage" :src="currentImage" />
        <button @click="acceptImage">Accept</button>
        <button @click="nextImage">Decline</button>
        {{currentIndex}} {{currentImage}}
        <button @click="printData">print</button>
    </div>
</template>

<script lang="ts" setup>
import axios from "axios";
import { ref, onMounted } from "vue";

let currentIndex=ref(0);
let images=ref([]);
let acceptedLocations=ref([]);

let currentImage=ref(null);

onMounted(async () => {
    const googleApiKey=import.meta.env.VITE_API_KEY;
    const overpassApiUrl="https://overpass-api.de/api/interpreter";

    let imageUrls;
    do {
        const { lat, lon }=await generateRandomCoordinates();
        const delta=Math.floor(Math.random()*100)+1;

        const bbox=generateBoundingBox({ lat, lon }, delta);

        imageUrls=await getAttractionsWithPhotos(bbox, overpassApiUrl, googleApiKey);
    } while (!imageUrls||imageUrls.length===0);

    images.value=imageUrls;
    currentImage.value=images.value[currentIndex.value].url;
});

const acceptImage=() => {
    acceptedLocations.value.push(images.value[currentIndex.value].location);
    nextImage();
}
function printData() {
    console.log(acceptedLocations.value);
    console.log(JSON.stringify(acceptedLocations.value));
}

const nextImage=() => {

    currentIndex.value++;
    if (currentIndex.value>=images.value.length) {
        console.log(acceptedLocations.value);
        currentIndex.value=0;
    }
    currentImage.value=images.value[currentIndex.value].url;
}


const continentBoundingBoxes={
    "Africa": { "minLat": -35, "maxLat": 37, "minLon": -17, "maxLon": 51 },
    "Antarctica": { "minLat": -90, "maxLat": -60, "minLon": -180, "maxLon": 180 },
    "Asia": { "minLat": 15, "maxLat": 55, "minLon": 30, "maxLon": 150 },
    "Australia": { "minLat": -50, "maxLat": -10, "minLon": 110, "maxLon": 160 },
    "Europe": { "minLat": 35, "maxLat": 70, "minLon": -10, "maxLon": 40 },
    "North America": { "minLat": 10, "maxLat": 70, "minLon": -130, "maxLon": -60 },
    "South America": { "minLat": -55, "maxLat": 12, "minLon": -80, "maxLon": -35 },
};


function generateRandomCoordinates(): { lat: number, lon: number } {
    const latitudeRange={
        min: -90,   // Minimum latitude (equator)
        max: 90,    // Maximum latitude (equator)
    };

    const longitudeRange={
        min: -180,  // Minimum longitude (Prime Meridian)
        max: 180,   // Maximum longitude (180th meridian)
    };

    // Generate random latitude and longitude within the specified ranges
    let latitude=Math.random()*(latitudeRange.max-latitudeRange.min)+latitudeRange.min;
    let longitude=Math.random()*(longitudeRange.max-longitudeRange.min)+longitudeRange.min;

    // Round to five decimal places
    latitude=Math.round(latitude*1e5)/1e5;
    longitude=Math.round(longitude*1e5)/1e5;

    return { lat: latitude, lon: longitude };
}
function generateBoundingBox(center: { lat: number, lon: number }, delta: number) {
    // Ensure latitude and longitude are within valid ranges
    const minLat=Math.max(center.lat-delta, -90);
    const maxLat=Math.min(center.lat+delta, 90);
    const minLon=Math.max(center.lon-delta, -180);
    const maxLon=Math.min(center.lon+delta, 180);

    return `${minLat},${minLon},${maxLat},${maxLon}`;
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
async function getAttractionsWithPhotos(bbox: string, overpassApiUrl: string, googleApiKey: string) {
    const overpassQuery=`
   [out:json][timeout:25];
(
  node["tourism"="attraction"]["wikipedia"](${bbox});
);
out body 5000;
>;
out skel qt;

    `;

    const overpassResponse=await axios.post(overpassApiUrl, `data=${encodeURIComponent(overpassQuery)}`, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    const overpassData=overpassResponse.data;

    const images=[];

    if (overpassData.elements.length===0) {
        return images;
    }

    let counter=0;
    for (const element of shuffleArray(overpassData.elements).sort(() => Math.random()-0.5)) {
        if (counter>50) break;
        const googleStreetViewUrl=`https://maps.googleapis.com/maps/api/streetview?size=600x300&fov=120&location=${element.lat},${element.lon}&return_error_code=true&pitch=10&heading=${Math.floor(Math.random()*360)}&key=${googleApiKey}`;
        try {
            const googleResponse=await axios.get(googleStreetViewUrl, { responseType: 'blob' });
            if (googleResponse.status===200) {
                images.push({ url: URL.createObjectURL(googleResponse.data), location: [element.lat, element.lon] });
            }
        } catch (error) {
            console.error(error);
        }
        counter+=1;
    }



    return images;
}
</script>
