<template>
    <div class="svg-container">
        <img src="../assets/game-logo-icon.png" width="500" />
        <!-- <svg id="color-fill" xmlns="http://www.w3.org/2000/svg" version="1.1" width="100%" height="300"
            xmlns:xlink="http://www.w3.org/1999/xlink">

            <polygon class="hex" points="300,150 225,280 75,280 0,150 75,20 225,20"></polygon>

        </svg> -->
    </div>
</template>

<style scoped lang="scss">
.svg-container {
    fill: #BB2D1B;
    transform-origin: center center;

    animation: spin 1.5s linear infinite;
}

@keyframes spin {
    0% {
        transform: scale(.15) rotate(-30deg);
    }

    25% {
        transform: scale(.125) rotate(0deg);
    }

    50% {
        transform: scale(.1) rotate(30deg);
    }

    25% {
        transform: scale(.125) rotate(0deg);
    }


    100% {
        transform: scale(.15) rotate(-30deg);
    }
}
</style>