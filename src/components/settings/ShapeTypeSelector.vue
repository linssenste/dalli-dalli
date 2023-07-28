<template>
    <div class="button-row">
        <div>
            <button v-on:click="shapeType='rectangle'" data-testid="button-1" class="icon-button"
                style="margin-right: 10px;" :class="{ 'icon-button-selected': (shapeType=='rectangle') }"><i
                    style="font-weight: 500;">1</i></button>
            <button v-on:click="shapeType='triangle'" class="icon-button" data-testid="button-2" style="margin-right: 10px;"
                :class="{ 'icon-button-selected': (shapeType=='triangle') }"><i style="font-weight: 500;">2</i></button>
            <button v-on:click="shapeType='hexagon'" class="icon-button" data-testid="button-3" style="margin-right: 10px;"
                :class="{ 'icon-button-selected': (shapeType=='hexagon') }"><i style="font-weight: 500;">3</i></button>
            <button v-on:click="shapeType='voronoi'" class="icon-button" data-testid="button-4" style="margin-right: 10px;"
                :class="{ 'icon-button-selected': (shapeType=='voronoi') }"><i style="font-weight: 500;">4</i></button>
        </div>

        <span class="shape-type">{{shapeType}}</span>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
const shapeType=ref<'triangle'|'rectangle'|'hexagon'|'voronoi'>('voronoi');
const emit=defineEmits(['update'])

watch(shapeType, () => {
    emit('update', shapeType.value)
}, { immediate: true })
</script>


<style scoped>
.button-row {
    position: relative;
    margin-top: 5px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.shape-type {
    font-weight: 500;
    text-transform: uppercase;
}
</style>