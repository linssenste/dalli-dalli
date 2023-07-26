// tests/ShapeSettings.spec.ts
import { mount, flushPromises } from "@vue/test-utils";
import { describe, expect, it, jest } from "vitest";
import ShapeSettings from "../../components/settings/ShapeSettings.vue";

jest.useFakeTimers();

describe("ShapeSettings", () => {
    it("renders the correct initial number of shapes", () => {
        const wrapper = mount(ShapeSettings);
        const numShapesText = wrapper.find(".shape-count-overlay b");

        // Initially, number of shapes is set to 50
        expect(numShapesText.text()).toBe("50");
    });

    it("decreases the number of shapes and disables the minus button if lower limit is reached", async () => {
        const wrapper = mount(ShapeSettings);

        const minusButton = wrapper.find('[data-testid="shape-count-minus"]');
        await minusButton.trigger("click");
        await flushPromises();

        const numShapesText = wrapper.find(".shape-count-overlay b");
        expect(numShapesText.text()).toBe("40");
        expect(minusButton.classes()).toContain("button-disabled");
    });

    it("increases the number of shapes and disables the plus button if upper limit is reached", async () => {
        const wrapper = mount(ShapeSettings, {
            data() {
                return { numTriangles: 240 };
            },
        });

        const plusButton = wrapper.find('[data-testid="shape-count-plus"]');
        await plusButton.trigger("click");
        await flushPromises();

        const numShapesText = wrapper.find(".shape-count-overlay b");
        expect(numShapesText.text()).toBe("250");
        expect(plusButton.classes()).toContain("button-disabled");
    });

    it("renders child components correctly", () => {
        const wrapper = mount(ShapeSettings);

        expect(wrapper.findComponent({ name: "ShapeCanvas" }).exists()).toBe(
            true
        );
        expect(wrapper.findComponent({ name: "TimerProgress" }).exists()).toBe(
            true
        );
        expect(
            wrapper.findComponent({ name: "ShapeTypeSelector" }).exists()
        ).toBe(true);
        expect(
            wrapper.findComponent({ name: "RemovalIntervalSettings" }).exists()
        ).toBe(true);
    });

    it("emits 'update' event with the correct data when settings is updated", async () => {
        const wrapper = mount(ShapeSettings);

        // Change the number of shapes
        const minusButton = wrapper.find('[data-testid="shape-count-minus"]');
        await minusButton.trigger("click");
        await flushPromises();

        let emittedEvent = wrapper.emitted("update");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([
            { interval: 0, shapes: 40, type: "voronoi" },
        ]);
    });
});
