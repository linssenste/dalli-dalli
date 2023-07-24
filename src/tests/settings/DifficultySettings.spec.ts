// tests/DifficultySettings.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import DifficultySettings from "../../components/settings/DifficultySettings.vue";

describe("difficulty level selector buttons + info text", () => {
    it("renders the correct initial difficulty level and description", () => {
        const wrapper = mount(DifficultySettings);
        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        // Initially, difficulty is set to 1
        expect(levelText.text()).toContain("Level 2");
        expect(descriptionText.text()).toContain("well-known places");
    });

    it("updates difficulty description on button click", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-3"]');
        await button.trigger("click");

        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );
        expect(descriptionText.text()).toContain("hidden gems");
    });

    it("renders 'Madness' difficulty correctly", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-4"]');
        await button.trigger("click");

        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        expect(levelText.text()).toContain("Madness");
        expect(descriptionText.text()).toContain(
            "random Street-View snapshots"
        );
    });

    it("renders 'Level 1: iconic tourist destinations' when gameDifficulty is 0", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-1"]');
        await button.trigger("click");

        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        expect(levelText.text()).toContain("Level 1");
        expect(descriptionText.text()).toContain("iconic tourist destinations");
    });

    it("renders 'Level 3: hidden gems' when gameDifficulty is 2", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-3"]');
        await button.trigger("click");

        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        expect(levelText.text()).toContain("Level 3");
        expect(descriptionText.text()).toContain("hidden gems");
    });

    it("adds the 'selected-difficulty' class to the clicked button", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-1"]');
        await button.trigger("click");

        expect(button.classes()).toContain("selected-difficulty");
    });

    it("removes the 'selected-difficulty' class from other buttons when a new one is clicked", async () => {
        const wrapper = mount(DifficultySettings);

        const button1 = wrapper.find('[data-testid="difficulty-button-1"]');
        const button2 = wrapper.find('[data-testid="difficulty-button-2"]');

        // Click the first button and ensure it gets the selected class
        await button1.trigger("click");
        expect(button1.classes()).toContain("selected-difficulty");

        // Then click the second button and ensure it gets the selected class
        await button2.trigger("click");
        expect(button2.classes()).toContain("selected-difficulty");

        // Make sure the first button no longer has the selected class
        expect(button1.classes()).not.toContain("selected-difficulty");
    });

    it("does not change game difficulty when no button is clicked", () => {
        const wrapper = mount(DifficultySettings);

        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        expect(levelText.text()).toContain("Level 2");
        expect(descriptionText.text()).toContain("well-known places");
    });

    it("remains unchanged on multiple clicks of the same button", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-3"]');

        // Click the button multiple times
        await button.trigger("click");
        await button.trigger("click");

        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        expect(levelText.text()).toContain("Level 3");
        expect(descriptionText.text()).toContain("hidden gems");
    });

    it("keeps the 'selected-difficulty' class on the same button after multiple clicks", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-1"]');

        // Click the button once
        await button.trigger("click");
        expect(button.classes()).toContain("selected-difficulty");

        // Click the button again
        await button.trigger("click");
        expect(button.classes()).toContain("selected-difficulty");
    });
});
