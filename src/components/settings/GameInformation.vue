<template>
    <div class="game-info-text">

        <div class="logo-container">
            <img draggable="false" class="logo" src="game-logo.webp" width="300" height="112" />
        </div>


        <div style="text-align: justify; padding: 20px;  font-size: 16px;">

            <p>
                This is a little game that combines the nostalgic charm of Dalli-Klick, a gem from the 1970's German
                TV show <a href="https://de.wikipedia.org/wiki/Dalli_Dalli" target="_blank">Dalli-Dalli</a>, with the
                modern thrill of <a href="https://geoguessr.com" target="_blank">Geoguessr</a>. <br>In this game,
                players
                are challenged with
                high
                quality photos of various locations around the world, from famous landmarks to
                enchanting hidden spots.
                The
                interesting twist is that these images are initially hidden behind a layer of triangles, which are then
                removed at random to reveal the location.
            </p>


            <p>
                Similar to Geoguessr, a score is calculated for each of the 5 rounds. The score combines your
                geographical
                instincts and keen observation. The closer your guess gets to the actual location, while the image is
                more
                hidden, the higher your score.
            </p>
            <b>Good guessing & have fun!</b>


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
    border-radius: 12px !important;


    padding-left: 20px;
    padding-right: 20px;
    font-size: 28px !important;
    letter-spacing: 1px !important;
    margin-top: 40px;
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
    width: 500px;
    /* height: 600px; */
    background-color: transparent;
    position: relative;
    border-radius: 12px;
    overflow: hidden;

}






.logo {
    fill: red;
    margin-top: 20px;
}

.logo:hover {
    fill: blue;
    /* Change to the color you want on hover */
}
</style>