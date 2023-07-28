// tests/DistanceMap.spec.ts
import { mount } from "@vue/test-utils";
import { describe, expect, it, beforeEach, vi } from "vitest";
import DistanceMap from "../../components/maps/DistanceMap.vue";

describe("DistanceMap", () => {
    let wrapper: any;

    const defaultProps = {
        location: {
            lat: 40.712776,
            lng: -74.005974,
        },
        guess: {
            lat: 34.052235,
            lng: -118.243683,
        },
    };

    beforeEach(() => {
        wrapper = mount(DistanceMap, {
            props: defaultProps,
        });
    });

    it("just if rendering...", () => {
        expect(wrapper.exists()).toBe(true);
    });
});
