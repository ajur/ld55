import { defineConfig } from 'vite'
import { resolve } from "path";

export default defineConfig({
    base: '/ld55/',
    resolve: {
        alias: {
            "~": resolve(__dirname, "src"),
        },
    }
});
