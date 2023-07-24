<template>
    <div>
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

                <img style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);"
                    src="rainbolt_smiley.png" width="20" />
            </button>
        </div>

        <!-- info text about the level -->
        <div data-testid="difficulty-button-info-text" class="level-info">
            <i class="fa-solid fa-star" style="font-size: 19px; color: #F8DA5F;" />
            <span data-testid="difficulty-level-text" class="level-text"><b v-if="gameDifficulty!=3">Level
                    {{gameDifficulty+1}}:</b><b v-else>Madness:</b></span>
            <span data-testid="difficulty-description-text" class="description-text">
                <span v-if="gameDifficulty==0">iconic tourist destinations</span>
                <span v-else-if="gameDifficulty==1">well-known places</span>
                <span v-else-if="gameDifficulty==2">hidden gems</span>
                <span v-else>random Street-View snapshots</span>
            </span>
        </div>
    </div>
</template>


<script lang="ts" setup>
import { ref, watch } from 'vue';
import { store } from '../../store';
const gameDifficulty=ref(1);

// updae diffictulty in store on change
watch(gameDifficulty, () => {
    console.log("UPDATE", store.state.settings.difficulty, gameDifficulty.value)
    store.commit('setGameSettings', {
        difficulty: gameDifficulty.value
    });
})

</script>


<style scoped>
.button-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.level-info {
    height: 60px;
    margin: 5px;
    margin-bottom: 20px;
    background-color: #F0F0F0;
    padding-left: 20px;
    border-radius: 12px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: start;
    font-size: 17px;
}


.difficulty-button {
    margin: 5px;
    position: relative;
    height: 50px;
    min-width: 50px;
    border-radius: 50px;
    color: #F8DA5F;
    background-color: #F0F0F0;
    transition: all 200ms;
    border: 2px solid transparent
}

.difficulty-button i {
    margin: 1px;
    margin-top: 2px;
    font-size: 18px;
}

.difficulty-button:hover {

    transition: all 200ms;
    border: 2px solid #BABABA
}

.selected-difficulty {
    background-color: #F8DA5F;
    color: white;
    transition: all 200ms;

}

.description-text {
    margin-left: 10px;
    letter-spacing: .5px;
    text-transform: uppercase;
}

.level-text {
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 15px;
}
</style>