import { createRouter, createWebHistory } from "vue-router";

import GeoDalliView from "../views/GeoDalliView.vue";
const routes = [
    {
        path: "/:pathMatch(.*)*",
        component: GeoDalliView,
    },
    {
        path: "/config",
        component: () => import("../views/ConfiguratorView.vue"),
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
