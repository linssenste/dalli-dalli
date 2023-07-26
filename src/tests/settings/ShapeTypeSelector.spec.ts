// tests/ShapeTypeSelector.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import ShapeTypeSelector from "../../components/settings/ShapeTypeSelector.vue";

describe("ShapeTypeSelector", () => {
    it("renders the correct initial shape type", () => {
        const wrapper = mount(ShapeTypeSelector);
        const shapeTypeText = wrapper.find(".shape-type");

        // Initially, shape type is set to 'voronoi'
        expect(shapeTypeText.text()).toContain("voronoi");
    });

    it("updates shape type to rectangle on button 1 click", async () => {
        const wrapper = mount(ShapeTypeSelector);

        const button1 = wrapper.find('[data-testid="button-1"]');
        await button1.trigger("click");

        const shapeTypeText = wrapper.find(".shape-type");
        expect(shapeTypeText.text()).toContain("rectangle");
    });

    it("updates shape type to triangle on button 2 click", async () => {
        const wrapper = mount(ShapeTypeSelector);

        const button2 = wrapper.find('[data-testid="button-2"]');
        await button2.trigger("click");

        const shapeTypeText = wrapper.find(".shape-type");
        expect(shapeTypeText.text()).toContain("triangle");
    });

    it("updates shape type to hexagon on button 3 click", async () => {
        const wrapper = mount(ShapeTypeSelector);

        const button3 = wrapper.find('[data-testid="button-3"]');
        await button3.trigger("click");

        const shapeTypeText = wrapper.find(".shape-type");
        expect(shapeTypeText.text()).toContain("hexagon");
    });

    it("updates shape type to voronoi on button 4 click", async () => {
        const wrapper = mount(ShapeTypeSelector);

        const button4 = wrapper.find('[data-testid="button-4"]');
        await button4.trigger("click");

        const shapeTypeText = wrapper.find(".shape-type");
        expect(shapeTypeText.text()).toContain("voronoi");
    });

    it("emits 'update' event with the correct data when shape type is updated", async () => {
        const wrapper = mount(ShapeTypeSelector);

        // Change shape type to rectangle
        const button1 = wrapper.find('[data-testid="button-1"]');
        await button1.trigger("click");

        let emittedEvent = wrapper.emitted("update");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual(["rectangle"]);
    });

    it("emits 'update' event with the correct data when shape type is updated multiple times", async () => {
        const wrapper = mount(ShapeTypeSelector);

        // Change shape type to rectangle
        const button1 = wrapper.find('[data-testid="button-1"]');
        await button1.trigger("click");

        // Change shape type to triangle
        const button2 = wrapper.find('[data-testid="button-2"]');
        await button2.trigger("click");

        let emittedEvent = wrapper.emitted("update");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(2);
        expect(emittedEvent![0]).toEqual(["rectangle"]);
        expect(emittedEvent![1]).toEqual(["triangle"]);
    });
});
