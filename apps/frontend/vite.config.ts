import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import { env } from "@repo/env/frontend";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: "react",
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: "../backend/dist",
  },
  server: {
    host: true,
    port: env.FRONTEND_PORT,
    proxy: {
      "/api": {
        target: `http://${env.BACKEND_HOST}:${env.BACKEND_PORT}`,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@frontend": path.resolve(__dirname, "src"),
      "@backend": path.resolve(__dirname, "../backend/src"),
      "@env": path.resolve(__dirname, "../../packages/env/src"),
    },
  },
});
