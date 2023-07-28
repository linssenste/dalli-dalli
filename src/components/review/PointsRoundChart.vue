<template>
    <div class="points-progress-container">

        <div class="points-progress-bar"
            :style="`width: calc(${score/5000}*100% + 50px); justify-content: ${score>=500? 'start; padding-left: 20px':'center'}`">


            <span style="font-size: 17px; padding-bottom: 2px; padding-right: 3px">+</span>{{score}}

        </div>
    </div>
</template>



<script lang="ts" setup>

const props=defineProps<{
    score: number,
}>();

props.score;
</script>


<style scoped>
.points-progress-container {
    width: 100% !important;
    height: 50px !important;
    position: relative;

    background-color: #F0F0F0;
    border-radius: 25px !important;

    transition: all 0.2s ease-in-out;
    overflow: hidden;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-select: none;
}

.points-progress-container:hover {
    background-color: #E0E0E0;
    transition: all 0.2s ease-in-out;
}



.points-progress-bar {
    height: 100%;
    background-color: #BB2D1B;
    border-radius: 25px !important;
    position: relative;
    color: white;
    font-size: 19px;
    font-weight: 700;
    display: flex;
    flex-direction: row;
    align-items: center;

}

.points-progress-bar span {
    text-align: end;
}
</style>
