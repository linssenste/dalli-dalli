<template>
    <div class="game-info-text">

        <div class="logo-container">
            <img draggable="false" class="logo" src="../../assets/game-logo.webp" width="300" height="112" />
        </div>


        <div style="text-align: justify; padding: 20px;  font-size: 16px;">

            <p>
                In this game, a famous landmark from around the world is carefully under a mosaic of shapes. As each
                shape is gradually removed, bits and pieces of the hidden image begin to peek out, challenging your
                geographical skills. Can you recognise the location before the full picture is revealed?
            </p>
            <p>
                Scoring in Dalli Dalli is easy, but requires a strategic approach. The earlier you guess while the picture
                is still largely hidden, and the closer your guess is to the actual location, the higher your score will be.
            </p>

            <p>
                Caught in a guessing deadlock? The Flag hint will come to the rescue and (maybe) gives you a crucial hint to
                steer
                you in the right direction.
            </p>



            <a draggable="false" class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/linssenste"><img
                    src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a coffee!"><span
                    style="margin-left:5px">Buy me a coffee!</span></a>
        </div>


    </div>
</template>

<style>
.bmc-button img {
    width: 27px !important;
    margin-bottom: 1px !important;
    box-shadow: none !important;
    border: none !important;
    margin-right: 10px;
    vertical-align: middle !important;
}

.bmc-button {
    height: 40px !important;
    font-family: 'biro_script_standardregular';
    text-decoration: none !important;
    display: flex !important;
    color: black !important;
    background-color: #F8DA5F !important;
    border-radius: 10px !important;


    padding-left: 20px;
    padding-right: 20px;
    font-size: 28px !important;
    letter-spacing: 1px !important;
    margin-top: 30px;
    /* text-transform: uppercase !important; */
    align-items: center;
    width: fit-content;
    transition: all 200ms;
    border: 2px solid transparent
}

.bmc-button span {
    margin-top: 8px;
}

.bmc-button:hover,
.bmc-button:active,
.bmc-button:focus {
    text-decoration: none !important;
    transition: all 200ms;
    border: 2px solid #BABABA !important
}
</style>
<style scoped>
.logo-container {
    /* position: absolute; */
    /* top: 0px;
    left: calc(50%);
    transform: translateX(-50%); */
    font-size: 30px;
    text-transform: uppercase;
    line-height: 30px;
}



.game-info-text {
    width: 550px;
    /* height: 600px; */
    background-color: transparent;
    position: relative;

    margin-top: 30px !important;
    border-radius: 10px;
    overflow: hidden;

}
</style>