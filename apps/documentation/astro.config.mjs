// @ts-check
import { defineConfig } from 'astro/config';
import honoAstro from "hono-astro-adapter";

import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  adapter: honoAstro(),
  output: "server",
  outDir: "../backend/static/docs",
  base: "/docs",
  vite: {
    plugins: [tailwindcss()],
  },
});