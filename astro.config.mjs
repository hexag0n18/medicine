import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false }, // tapa la navegacion inferior en pantallas pequenas
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Cognito de floci no responde el preflight CORS del navegador; en desarrollo se le llega por este proxy
      proxy: { "/cognito": { target: "http://localhost:4566", rewrite: (p) => p.replace(/^\/cognito/, "") } },
    },
  },
});
