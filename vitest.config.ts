import { fileURLToPath } from "node:url";
import { mergeConfig } from "vite";
import { configDefaults, defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
    viteConfig,
    defineConfig({
        test: {
            exclude: [...configDefaults.exclude, "packages/template/*"],
            globals: true,
            environment: "happy-dom",
        },
    })
);
