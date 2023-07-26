<template>
    <div v-if="interval>=1000" class="progress-area">
        <div :key="interval" :style="`width: ${(counter/interval)*100}%`" class="progress-bar">

        </div>

    </div>
</template>


<script setup lang="ts">

import { ref, watch, onBeforeUnmount } from 'vue'

const props=defineProps<{
    interval: number
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
        // emit('update')
        intervalHandler.value=setInterval(() => {

            if (counter.value<=0) {

                emit('update')
                counter.value=props.interval

            } else {

                counter.value-=5;
            }

        }, 1)
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