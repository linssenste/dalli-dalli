<template>
    <div v-if="interval>=1000" class="progress-area" :style="`background-color: ${overlay ? '#d0d0d0' : '#F0F0F0'}`">
        <div :key="interval" :style="`width: ${(counter/interval)*100}%; ${overlay ? 'background-color: #BB2D1B' : ''}`" class="progress-bar">

        </div>

    </div>
</template>


<script setup lang="ts">

import { ref, watch, onBeforeUnmount } from 'vue'

const props=defineProps<{
    interval: number,
    pause: boolean,
    preview?: boolean, 
	overlay?: boolean
}>();


props.interval;
const emit=defineEmits(['update']);

const intervalHandler=ref<ReturnType<typeof setInterval>|null>(null);

onBeforeUnmount(() => {
    if (intervalHandler.value!=null) clearInterval(intervalHandler.value)
})

const counter=ref(props.interval);
watch(() => props.interval, () => {
	
    if (intervalHandler.value!=null) {
        clearInterval(intervalHandler.value);
        counter.value=props.interval
    }
    if (props.interval==0) return
    else {
        // if (!props.preview) emit('update')
        intervalHandler.value=setInterval(() => {
            if (props.pause===true) return;
            if (counter.value<=0) {

                emit('update')
                counter.value=props.interval

            } else {

                counter.value-=10;
            }

        }, 10)
    }

}, { immediate: true })

</script>


<style scoped>
.progress-area {
    width: 100%;
    /* border-radius: 7px; */
    height: 14px;
    background-color: #F0F0F0;
}

.progress-bar {
    height: 100%;
    background-color: #a0a0a0;
    border-top-right-radius: 7px;
    border-bottom-right-radius: 7px;
}
</style>