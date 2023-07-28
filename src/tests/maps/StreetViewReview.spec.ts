// tests/StreetViewReview.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import StreetViewReview from "../../components/maps/StreetViewReview.vue";

describe("Street View component", () => {
    let wrapper;

    const defaultProps = {
        image: "path/to/image.jpg",
        config: {
            lat: 52.52,
            lng: 13.405,
            heading: 75,
            pitch: 0,
            fov: 90,
        },
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
        streetViewPanoramaMock.mockClear(); // clear previous mock calls
        wrapper = mount(StreetViewReview, {
            props: defaultProps,
        });
    });

    it("calls StreetViewPanorama when the component is mounted", () => {
        expect(streetViewPanoramaMock).toBeCalled();
    });
    it("calls setPov with the right parameters when the component is mounted", () => {
        expect(setPovMock).toBeCalledWith({
            heading: defaultProps.config.heading,
            pitch: defaultProps.config.pitch,
        });
    });
});
