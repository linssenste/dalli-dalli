// tests/MapSelector.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import MapSelector from "../../components/maps/MapSelector.vue";

describe("MapSelector component", () => {
    it("renders correctly initially", () => {
        const wrapper = mount(MapSelector, {
            props: {
                roundId: 1,
            },
        });
        expect(wrapper.find('[data-testid="selection-area"]').exists()).toBe(
            true
        );
        expect(wrapper.find('[data-testid="selection-map"]').exists()).toBe(
            true
        );
        expect(wrapper.find('[data-testid="guess-button"]').exists()).toBe(
            true
        );
    });

    it("submits the data on button click", async () => {
        const wrapper = mount(MapSelector, {
            props: {
                roundId: 1,
            },
        });
        const button = wrapper.find('[data-testid="guess-button"]');
        await button.trigger("click");
        // Check if the "submit" event is emitted with the current location value
        const emittedEvent = wrapper.emitted("submit");
        expect(emittedEvent).toBeDefined();
        // As initial location value is null, it should emit null
        expect(emittedEvent![0]).toEqual([null]);
    });

    it("disable submit button when no location selected", () => {
        const wrapper = mount(MapSelector, {
            props: {
                roundId: 1,
            },
        });
        const button = wrapper.find('[data-testid="guess-button"]');
        expect(button.classes()).toContain("disabled-button");
    });
});
