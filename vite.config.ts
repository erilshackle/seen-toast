import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib:{
            entry: "src/index.ts",
            name: "Seen",
            fileName: (format) => `seen.${format}.js`,
        },
        rollupOptions: {
            external: [],
        },
    },
});