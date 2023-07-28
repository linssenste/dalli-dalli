// tests/RoundStats.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import RoundStats from "../../components/review/RoundStats.vue";

describe("RoundStats", () => {
    const defaultProps = {
        place: {
            lat: 52.52,
            lng: 13.405,
            guess: { lat: 52.5095, lng: 13.3766 },
            visibility: 75,
        },
        score: 12,
        miles: true,
    };

    it("renders score when score is provided", () => {
        const wrapper = mount(RoundStats, { props: defaultProps });
        const scoreCard = wrapper.find('[data-testid="score-card"]');
        expect(scoreCard.text()).toContain("SCORE:12 Points");
    });

    it("does not render score when score is null", () => {
        const wrapper = mount(RoundStats, {
            props: { ...defaultProps, score: undefined },
        });
        const scoreCard = wrapper.find('[data-testid="score-card"]');
        expect(scoreCard.exists()).toBe(false);
    });

    it("renders visibility correctly", () => {
        const wrapper = mount(RoundStats, { props: defaultProps });
        const visibilityCard = wrapper.find('[data-testid="visibility-card"]');
        expect(visibilityCard.text()).toContain("VISIBILITY:75.00%");
    });

    it("renders distance in miles when 'miles' prop is true", () => {
        const wrapper = mount(RoundStats, { props: defaultProps });
        const distanceCard = wrapper.find('[data-testid="distance-card"]');
        expect(distanceCard.text()).toContain("mi"); // the actual value depends on the distance function output
    });

    it("renders distance in kilometers when 'miles' prop is false", () => {
        const wrapper = mount(RoundStats, {
            props: { ...defaultProps, miles: false },
        });
        const distanceCard = wrapper.find('[data-testid="distance-card"]');
        expect(distanceCard.text()).toContain("km"); // the actual value depends on the distance function output
    });
});
