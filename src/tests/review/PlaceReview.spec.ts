// tests/PlaceReview.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it, beforeEach, vi } from "vitest";
import PlaceReview from "../../components/review/PlaceReview.vue";

describe("PlaceReview", () => {
    let wrapper: any;

    const defaultProps = {
        data: {
            settings: {
                difficulty: 1,
            },
            places: [
                {
                    lat: 40.712776,
                    lng: -74.005974,
                    guess: { lat: 34.052235, lng: -118.243683 },
                    visibility: 50,
                    pov: { heading: 100, pitch: 0, zoom: 1 },
                    score: 1000,
                },
                // other places...
            ],
        },
        roundId: 0,
    };

    const setPovMock = vi.fn();

    const streetViewPanoramaMock = vi.fn(() => ({
        setPov: setPovMock,
    }));

    global.google = {
        maps: {
            StreetViewPanorama: streetViewPanoramaMock,
        },
    };

    beforeEach(() => {
        wrapper = mount(PlaceReview, {
            props: defaultProps,
        });
    });

    it("renders the ImageReview component when difficulty is not 3", async () => {
        expect(wrapper.find('[data-testid="image-review"]').exists()).toBe(
            true
        );
    });

    it("renders the StreetViewReview component when difficulty is 3", async () => {
        await wrapper.setProps({
            data: { ...defaultProps.data, settings: { difficulty: 3 } },
        });
        expect(
            wrapper.find('[data-testid="street-view-review"]').exists()
        ).toBe(true);
    });

    it("renders the PointsRoundChart and RoundStats components", () => {
        expect(wrapper.find('[data-testid="chart-stat"]').exists()).toBe(true);
        expect(wrapper.find('[data-testid="card-stats"]').exists()).toBe(true);
    });

    it("renders the DistanceMap component", () => {
        expect(
            wrapper.find('[data-testid="guess-distance-map"]').exists()
        ).toBe(true);
    });

    it("emits 'continue' event when 'next round' button is clicked", async () => {
        await wrapper
            .find('[data-testid="next-round-button"]')
            .trigger("click");
        expect(wrapper.emitted()).toHaveProperty("continue");
    });
});
