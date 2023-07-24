import { createApp } from "vue";
import "@fortawesome/fontawesome-free/css/all.css";
import "./assets/font/stylesheet.css";
import "./assets/handwriting/Biro Script Std/stylesheet.css";
import "./style.css";
import App from "./App.vue";
import { store } from "./store";
createApp(App).use(store).mount("#app");
