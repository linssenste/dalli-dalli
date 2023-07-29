<template>
    <div class="game-info-text" id="honeycomb">

        <div class="overview-text">
            <div class="fade-border">
            </div>




            <div style="text-align: justify;  display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%; padding: 20px;  font-size: 16px; z-index: 100; width: 450px">
                <div class="logo-container">
                    <img draggable="false" class="logo" src="../../assets/game-logo.webp" width="300" height="112" />
                </div>

                <div
                    style="font-family: 'biro_script_standardregular'; font-size: 40px; line-height: 50px; margin-top: 25px; text-align: start; width: 100%;">
                    {{greeting}}!
                </div>
                <!-- <div styl>* Hello</div> -->
                <p>
                    In this game, a famous landmark from around the world is carefully under a mosaic of shapes. As each
                    shape is gradually removed, bits and pieces of the hidden image begin to peek out, challenging your
                    geographical skills. Can you recognise the location before the full picture is revealed?
                </p>
                <p>
                    Scoring in Dalli Dalli is easy, but requires a strategic approach. The earlier you guess while the
                    picture
                    is still largely hidden, and the closer your guess is to the actual location, the higher your score will
                    be.
                </p>

                <p>
                    Caught in a guessing deadlock? The Flag hint will come to the rescue and (maybe) gives you a crucial
                    hint to
                    steer
                    you in the right direction.
                </p>

                <!-- Place this tag where you want the button to render. -->
                <github-button href="https://github.com/linssenste/dalli-dalli" style="width: 100%; height: 28px"
                    data-color-scheme="no-preference: light_high_contrast; light: light; dark: dark;" data-size="large"
                    data-show-count="true" aria-label="Star linssenste/dalli-dalli on GitHub">View on GitHub</github-button>


            </div>
        </div>

    </div>
</template>


<script lang="ts" setup>
import { computed } from 'vue';
import GithubButton from 'vue-github-button'

let greetings=[
    // previously provided greetings
    "Hello", "Hi", "Hey", "Hola", "Que pasa", "Salut", "Ciao", "Buongiorno", "Hallo",
    "Servus", "Heya", "Oi", "Ola", "Hej", "Hei", "Hiya", "Whats up", "Yo", "Hoi", "Goeiedag", "Ahoj", "Heus",

    // additional greetings
    "Zdravo", // Serbian
    "Merhaba", // Turkish
    "Salam", // Arabic, Persian
    "Shalom", // Hebrew
    "Namaste", // Hindi
    "Sat sri akal", // Punjabi
    "Konnichiwa", // Japanese
    "Ni hao", // Mandarin Chinese
    "Annyeonghaseyo", // Korean
    "Sawasdee", // Thai
    "Aloha", // Hawaiian
    "Kumusta", // Filipino
    "Selam", // Amharic, Tigrinya
    "Jambo", // Swahili
    "Hejira", // Maltese
    "Buna", // Romanian
    "Dzien dobry", // Polish
    "Pryvit", // Ukrainian
    "Sveiki", // Latvian
    "Labas", // Lithuanian
    "Tere", // Estonian
    "God dag", // Norwegian, Swedish
    "Goedendag", // Dutch
    "Yassas", // Greek
    "Szervusz", // Hungarian
    "Pozdrav", // Croatian
    "Zdravstvuyte", // Russian
    "Sholem aleikhem", // Yiddish
    "Barev", // Armenian
    "Salamun alaykum", // Azerbaijani
    "Marhaban", // Arabic
    "Shlama", // Assyrian
    "Niltze", // Nahuatl
    "Habari", // Swahili
];



const greeting=computed(() => {
    return greetings[Math.floor(Math.random()*greetings.length)];
})
</script>

<style></style>
<style scoped>
.logo-container {
    /* position: absolute; */
    /* top: 0px;
    left: calc(50%);
    transform: translateX(-50%); */
    /* margin-top: 20px; */
    margin-bottom: 10px;
    font-size: 30px;
    text-transform: uppercase;
    line-height: 30px;
}



.game-info-text {
    width: 100%;
    max-width: 50%;
    min-height: 112px;
    color: black !important;
    /* height: 600px; */
    background-color: transparent;
    position: relative;



    /* margin-top: 30px !important; */
    /* border-radius: 10px; */
    overflow: hidden;

}

.fade-border {
    position: absolute;
    bottom: 0px;
    right: 0px;
    width: 150px;
    height: 100%;
    border-radius: 0px !important;
    transform: rotate(180deg);
}

.fade-border::before {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    width: 150px;
    height: 100%;
    background: linear-gradient(to right, white, transparent);
}

.overview-text {
    position: relative;
    width: 100%;
    height: 100%;
    z-index: 100;
    background-color: #FAFAFADD;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
    z-index: 100 !important;
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: center;

    /* Add the backdrop filter */
    backdrop-filter: blur(6px);
    /* Adjust the blur radius as needed */
    -webkit-backdrop-filter: blur(10px);
    /* For compatibility with some browsers */
}


#honeycomb {
    width: 100%;
    height: 100%;
    background: center url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='rgba(187, 45, 27, 1)' viewBox='0 0 100 169.5'%3E%3Cpolygon points='50,34.75 93.5,59.75 93.5,109.75 50,134.75 6.5,109.75 6.5,59.75'%3E%3C/polygon%3E%3Cpolygon points='0,-50 43.5,-25 43.5,25 0,50 -43.5,25 -43.5,-25'%3E%3C/polygon%3E%3Cpolygon points='100,-50 143.5,-25 143.5,25 100,50 56.5,25 56.5,-25'%3E%3C/polygon%3E%3Cpolygon points='0,119.5 43.5,144.5 43.5,194.5 0,219.5 -43.5,194.5 -43.5,144.5'%3E%3C/polygon%3E%3Cpolygon points='100,119.5 143.5,144.5 143.5,194.5 100,219.5 56.5,194.5 56.5,144.5'%3E%3C/polygon%3E%3C/svg%3E");
    background-size: 60px;
    animation: slide 5s linear infinite;
}

@keyframes slide {
    0% {
        background-position: 0 0;
    }

    100% {
        background-position: -60px 0;
    }
}
</style>