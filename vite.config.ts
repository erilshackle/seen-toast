import { defineConfig } from "vite";

export default defineConfig({
  build: {
    cssCodeSplit: false,

    lib: {
      entry: "src/index.ts",
      name: "Seen",

      formats: ["es", "umd"],

      fileName: (format) =>
        `seentoast.${format}.js`
    },

    rollupOptions: {
      output: {
        exports: "named",

        assetFileNames: (assetInfo) => {
          if (assetInfo.names[0] === "style.css") {
            return "seentoast.css";
          }

          return assetInfo.name!;
        }
      }
    }
  }
});