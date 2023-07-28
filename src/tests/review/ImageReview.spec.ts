// tests/ImageReview.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it, beforeEach } from "vitest";
import ImageReview from "../../components/review/ImageReview.vue";

describe("ImageReview", () => {
    let wrapper: any;

    const defaultProps = {
        place: {
            countryId: "US",
            name: "New York",
            images: [
                {
                    src: "https://images.pexels.com/photos/5855477/pexels-photo-5855477.jpeg",
                    photographer: "John Doe",
                    photographer_url: "https://example.com/photographer1",
                },
                {
                    src: "https://images.pexels.com/photos/5855477/pexels-photo-5855477.jpeg",
                    photographer: "Jane Doe",
                    photographer_url: "https://example.com/photographer2",
                },
            ],
            imageId: 0,
        },
    };

    beforeEach(() => {
        wrapper = mount(ImageReview, {
            props: defaultProps,
        } as any);
    });

    it("displays the correct photographer name and URL for the current image", () => {
        const photographerLink = wrapper.find(
            '[data-testid="photographer-link"]'
        );
        expect(photographerLink.text()).toContain(
            defaultProps.place.images[0].photographer
        );
        expect(photographerLink.attributes("href")).toBe(
            defaultProps.place.images[0].photographer_url
        );
    });

    it("displays the correct place name and country flag", () => {
        const placeName = wrapper.find('[data-testid="static-place-name"]');
        expect(placeName.text()).toContain(defaultProps.place.name);
        expect(placeName.find("img").attributes("src")).toBe(
            `http://purecatamphetamine.github.io/country-flag-icons/3x2/${defaultProps.place.countryId}.svg`
        );
    });

    it("displays a link to Pexels", () => {
        const pexelsLink = wrapper.find('[data-testid="pexels-link"]');
        expect(pexelsLink.exists()).toBe(true);
    });

    it("starts with image loading state as false", () => {
        expect(wrapper.vm.zoomImageLoaded).toBe(false);
    });

    it("changes the image loading state after image load event", async () => {
        // Assuming that zoomImageLoaded becomes true when the image load event is fired
        wrapper.vm.loadedImageEvent();
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Waiting for the image to load
        await wrapper.vm.$nextTick(); // Waiting for the next "tick" to let Vue process the event
        expect(wrapper.vm.zoomImageLoaded).toBe(true);
    });

    it("changes the currentImageIndex when clicking on a preview image", async () => {
        const imagePreviews = wrapper.findAll(
            '[data-testid="preview-images"] div.other-image'
        );

        // Test for the second image preview
        const secondImagePreview = imagePreviews[1];
        await secondImagePreview.trigger("click");
        expect(wrapper.vm.currentImageIndex).toBe(1);
    });
});
