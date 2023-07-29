<template>
    <div class="loading-overlay">
        <div class="svg-container">
            <img src="../../assets/game-logo-icon.png" width="500" />
        </div>
    </div>
</template>

<style scoped lang="scss">
.loading-overlay {
    position: relative;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: white;
    display: flex;
    justify-content: center;
    align-items: center;
}

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