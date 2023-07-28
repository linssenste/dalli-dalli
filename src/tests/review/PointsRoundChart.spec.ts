// tests/PointsRoundChart.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it, beforeEach } from "vitest";
import PointsRoundChart from "../../components/review/PointsRoundChart.vue";

describe("PointsRoundChart", () => {
    let wrapper: any;

    const defaultProps = {
        score: 2000,
    };

    beforeEach(() => {
        wrapper = mount(PointsRoundChart, {
            props: defaultProps,
        });
    });

    it("renders the component", () => {
        expect(wrapper.find('[data-testid="progress-base"]').exists()).toBe(
            true
        );
    });

    it("displays the correct score", () => {
        const progressBar = wrapper.find('[data-testid="progress-bar"]');
        expect(progressBar.text()).toContain(defaultProps.score.toString());
    });
});
