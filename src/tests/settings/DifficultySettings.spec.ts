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

    it("renders 'Level 1: tourist destinations' when gameDifficulty is 0", async () => {
        const wrapper = mount(DifficultySettings);

        const button = wrapper.find('[data-testid="difficulty-button-1"]');
        await button.trigger("click");

        const levelText = wrapper.find('[data-testid="difficulty-level-text"]');
        const descriptionText = wrapper.find(
            '[data-testid="difficulty-description-text"]'
        );

        expect(levelText.text()).toContain("Level 1");
        expect(descriptionText.text()).toContain("tourist destinations");
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

    it("emits 'change' event with the correct data when difficulty level is updated", async () => {
        const wrapper = mount(DifficultySettings);

        // Click the first button to update difficulty level to 0
        const button1 = wrapper.find('[data-testid="difficulty-button-1"]');
        await button1.trigger("click");
        let emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([{ difficulty: 0 }]);

        // Click the second button to update difficulty level to 1
        const button2 = wrapper.find('[data-testid="difficulty-button-2"]');
        await button2.trigger("click");
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(2);
        expect(emittedEvent![1]).toEqual([{ difficulty: 1 }]);

        // Click the third button to update difficulty level to 2
        const button3 = wrapper.find('[data-testid="difficulty-button-3"]');
        await button3.trigger("click");
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(3);
        expect(emittedEvent![2]).toEqual([{ difficulty: 2 }]);

        // Click the fourth button to update difficulty level to 3 (Madness)
        const button4 = wrapper.find('[data-testid="difficulty-button-4"]');
        await button4.trigger("click");
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(4);
        expect(emittedEvent![3]).toEqual([{ difficulty: 3 }]);
    });

    it("emits 'change' event with the correct data when streetViewDifficulty is updated", async () => {
        const wrapper = mount(DifficultySettings);

        // Click the streetViewDifficulty mountain button to update terrain to 3
        const buttonMountain = wrapper.find(
            '[data-testid="streetview-terrain-3"]'
        );
        await buttonMountain.trigger("click");
        let emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([{ difficulty: 1, terrain: 3 }]);

        // Click the streetViewDifficulty city button to update terrain to 2
        const buttonCity = wrapper.find('[data-testid="streetview-terrain-2"]');
        await buttonCity.trigger("click");
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(2);
        expect(emittedEvent![1]).toEqual([{ difficulty: 1, terrain: 2 }]);

        // Click the streetViewDifficulty landmark-dome button to update terrain to 1
        const buttonLandmarkDome = wrapper.find(
            '[data-testid="streetview-terrain-1"]'
        );
        await buttonLandmarkDome.trigger("click");
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(3);
        expect(emittedEvent![2]).toEqual([{ difficulty: 1, terrain: 1 }]);
    });

    it("does not emit 'change' event when the same streetViewDifficulty button is clicked", async () => {
        const wrapper = mount(DifficultySettings);

        // Click the streetViewDifficulty mountain button to update terrain to 3
        const buttonMountain = wrapper.find(
            '[data-testid="streetview-terrain-3"]'
        );
        await buttonMountain.trigger("click");
        let emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([{ difficulty: 1, terrain: 3 }]);

        // Click the same streetViewDifficulty mountain button again
        await buttonMountain.trigger("click");

        // The emitted event should not have changed
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([{ difficulty: 1, terrain: 3 }]);
    });

    it("does not emit 'change' event when gameDifficulty is not 3 (Madness)", async () => {
        const wrapper = mount(DifficultySettings);

        // Click the streetViewDifficulty mountain button to update terrain to 3
        const buttonMountain = wrapper.find(
            '[data-testid="streetview-terrain-3"]'
        );
        await buttonMountain.trigger("click");
        let emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([{ difficulty: 1, terrain: 3 }]);

        // Click the streetViewDifficulty mountain button again
        await buttonMountain.trigger("click");

        // Change the gameDifficulty to a value other than 3 (Madness)
        const buttonHard = wrapper.find('[data-testid="difficulty-button-3"]');
        await buttonHard.trigger("click");

        // Click the streetViewDifficulty city button to update terrain to 2
        const buttonCity = wrapper.find('[data-testid="streetview-terrain-2"]');
        await buttonCity.trigger("click");

        // The emitted event should not have changed, as the gameDifficulty is not 3
        emittedEvent = wrapper.emitted("change");
        expect(emittedEvent).toBeDefined();
        expect(emittedEvent?.length).toBe(1);
        expect(emittedEvent![0]).toEqual([{ difficulty: 1, terrain: 3 }]);
    });
});
