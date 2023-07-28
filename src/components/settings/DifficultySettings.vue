<template>
    <div>

        <!-- info text about the level -->
        <div data-testid="difficulty-button-info-text" class="level-info">
            <i class="fa-solid fa-star" style="font-size: 19px; color: #F8DA5F;" />
            <span data-testid="difficulty-level-text" class="level-text"><b>Level
                    {{gameDifficulty+1}}:</b></span>
            <span data-testid="difficulty-description-text" class="description-text">
                <span v-if="gameDifficulty==0">tourist destinations</span>
                <span v-else-if="gameDifficulty==1">well-known places</span>
                <span v-else-if="gameDifficulty==2">hidden gems</span>
                <span v-else>Street-View snapshots</span>
            </span>

        </div>
        <div class="button-row">

            <!-- level 3: easy mode button -->
            <button data-testid="difficulty-button-1" :class="{ 'selected-difficulty': gameDifficulty==0 }"
                class="difficulty-button" @click="gameDifficulty=0">

                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
                <i class="fa-regular fa-star"></i>
            </button>

            <!-- level 3: medium mode button -->
            <button data-testid="difficulty-button-2" :class="{ 'selected-difficulty': gameDifficulty==1 }"
                class="difficulty-button" @click="gameDifficulty=1">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-regular fa-star"></i>
            </button>

            <!-- level 3: hard mode button -->
            <button data-testid="difficulty-button-3" :class="{ 'selected-difficulty': gameDifficulty==2 }"
                class="difficulty-button" @click="gameDifficulty=2">

                <i class="fa-solid fa-star "></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>

            </button>

            <!-- level 3: madness mode button -->
            <button data-testid="difficulty-button-4" :class="{ 'selected-difficulty': gameDifficulty==3 }"
                class="difficulty-button" @click="gameDifficulty=3">

                <i class="fa-solid fa-street-view"
                    style="color: #505050; position: absolute; top: calc(50% - 2px); left: calc(50% - .5px); transform: translate(-50%, -50%);" />

            </button>
        </div>


        <div v-if="gameDifficulty===3" class="street-view-visibility">
            <span
                style="font-size: 17px; text-transform: uppercase; letter-spacing: .5px; color: #303030; font-weight: 500;">Street
                view difficulty:</span>
            <div>
                <button class="icon-button" :style="streetViewDifficulty!==1? 'color: #30303040':''"
                    v-on:click="streetViewDifficulty=1" style="margin: 5px;" data-testid="streetview-terrain-1"><i
                        class="fa-solid fa-landmark-dome" /></button>
                <button class="icon-button" :style="streetViewDifficulty!==2? 'color: #30303040':''"
                    v-on:click="streetViewDifficulty=2" style="margin: 5px;" data-testid="streetview-terrain-2"><i
                        class="fa-solid fa-city" /></button>

                <button class="icon-button" :style="streetViewDifficulty!==3? 'color: #30303040':''"
                    v-on:click="streetViewDifficulty=3" style="margin: 5px; margin-right: 0px;"
                    data-testid="streetview-terrain-3"><i class="fa-solid fa-mountain" /></button>
            </div>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';

const emit=defineEmits(['change'])

const gameDifficulty=ref(parseInt(((new URL(document.location as any)).searchParams).get('difficulty')||'1'));
const streetViewDifficulty=ref(parseInt(((new URL(document.location as any)).searchParams).get('terrain')||'1'));

watch(streetViewDifficulty, () => {
    emit('change', {
        difficulty: gameDifficulty.value,
        terrain: streetViewDifficulty.value
    });
}, { immediate: true })


watch(gameDifficulty, () => {

    emit('change', {
        difficulty: gameDifficulty.value,
        terrain: streetViewDifficulty.value
    });
}, { immediate: true })

</script>


<style scoped>
.button-row {
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
}

.level-info {
    height: 60px;
    background-color: #f0f0f0;
    padding-left: 20px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    font-size: 17px;
}

.difficulty-button {
    position: relative;
    height: 48px;
    min-width: 48px;
    border-radius: 24px;
    color: #f8da5f;
    background-color: #f0f0f0;
    transition: border-color 200ms;
    padding: 0 13px;
    border: 2px solid transparent;
}

.difficulty-button i {
    margin: 1px;
    margin-top: 2px;
    font-size: 19px;
}

.difficulty-button:hover {
    border-color: #bababa;
}

.selected-difficulty {
    background-color: #f8da5f;
    color: white;
}

.description-text,
.level-text {
    text-transform: uppercase;
    letter-spacing: 1px;
}

.description-text {
    margin-left: 6px;
}

.level-text {
    margin-left: 15px;
}

.street-view-visibility {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
}
</style>