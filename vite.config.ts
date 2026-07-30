import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const API_TARGET = "https://stock-production-d03d.up.railway.app";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: API_TARGET,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
