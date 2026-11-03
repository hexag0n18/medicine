import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import { loadEnv } from 'vite';

const env = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), 'PUBLIC_');

export default defineConfig({
  integrations: [react()],
  devToolbar: { enabled: false }, // tapa la navegacion inferior en pantallas pequenas
  vite: {
    plugins: [tailwindcss()],
    server: {
      // Solo aplica a astro dev; el build usa PUBLIC_API_URL directamente.
      proxy: {
        '^/s3-upload/telemedicina-documentos-968579693864/': {
          target: 'https://s3.us-east-2.amazonaws.com',
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/s3-upload/, ''),
          bypass: (request) => request.method === 'PUT' ? undefined : false,
        },
        '/api': {
          target: env.PUBLIC_API_URL,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api(?=\/)/, ''),
        },
        '/cognito': { target: 'http://localhost:4566', rewrite: (path) => path.replace(/^\/cognito/, '') },
      },
    },
  },
});
