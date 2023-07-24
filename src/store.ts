import { createStore } from "vuex";

export const store = createStore({
    state() {
        return {
            settings: {
                configured: false,
                difficulty: 1,
                interval: true,
                triangles: 50,
                time: 1000,
            },
            score: 0,
            scoreList: [],
        };
    },
    mutations: {
        resetScore(state) {
            state.score = 0;
            state.scoreList = [];
        },
        addScore(state, score) {
            state.score += score;
            state.scoreList.push(score);
        },

        setGameSettings(state, data) {
            state.settings = { ...state.settings, ...data };
        },
    },
});
