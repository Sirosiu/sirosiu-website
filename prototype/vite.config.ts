import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  publicDir: "frontend/public",
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("/node_modules/three/")) return "three-vendor";
          if (id.includes("/node_modules/@react-three/fiber/")) return "fiber-vendor";
        },
      },
    },
  },
});
