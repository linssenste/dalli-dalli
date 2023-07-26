// tests/RemovalIntervalSettings.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import RemovalIntervalSettings from "../../components/settings/RemovalIntervalSettings.vue";

describe("RemovalIntervalSettings", () => {
    it("renders the correct initial timing", () => {
        const wrapper = mount(RemovalIntervalSettings);
        const timeText = wrapper.find('[data-testid="time-text"]');

        // Initially, timing is set to 1000ms
        expect(timeText.text()).toContain("MANUAL");
    });

    it("updates timing on slider change", async () => {
        const wrapper = mount(RemovalIntervalSettings);

        const input = wrapper.find('[data-testid="input-range"]');
        await input.setValue(2000);

        const timeText = wrapper.find('[data-testid="time-text"]');
        expect(timeText.text()).toContain("2 s");
    });

    it("displays 'MANUAL' when timing is set to 0", async () => {
        const wrapper = mount(RemovalIntervalSettings);

        const input = wrapper.find('[data-testid="input-range"]');
        await input.setValue(0);

        const timeText = wrapper.find('[data-testid="time-text"]');
        expect(timeText.text()).toContain("MANUAL");
    });

    it("emits 'update' event with the correct data when timing is updated", async () => {
        const wrapper = mount(RemovalIntervalSettings);

        // Change timing to 2000
        const input = wrapper.find('[data-testid="input-range"]');
        await input.setValue(2000);

        let emittedEvent = wrapper.emitted("update");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual(["2000"]);
    });
});
