import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.js",
  },
  server: {
    proxy: {
      "/api": {
        target: "https://ticketguru.hellmanstudios.fi",
        changeOrigin: true,
        secure: false, // Disable SSL verification if needed
        rewrite: (path) => path.replace(/^\/api/, ""), // Removes /api prefix
      },
    },
  },
});
