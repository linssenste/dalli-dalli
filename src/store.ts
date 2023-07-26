import { createStore } from "vuex";

export const store = createStore({
    state() {
        return {
            settings: {
                difficulty: 1,
                interval: 0,
                shapes: 50,
                type: "voronoi",
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
            console.log("SET");
            state.settings = { ...state.settings, ...data };
        },
    },
});
