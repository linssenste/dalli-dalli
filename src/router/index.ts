import { createRouter, createWebHistory } from "vue-router";

import GeoDalliView from "../views/GeoDalliView.vue";
import DalliDalliView from "../views/DalliDalliView.vue";
const routes = [
    {
        path: "/:pathMatch(.*)*",
        component: GeoDalliView,
    },

	{
        path: "/viewer",
        component: DalliDalliView,
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
