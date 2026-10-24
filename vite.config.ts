import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { bodyBake } from './vite-plugin-bodybake';

// Product microsite: no API key, no environment defines.
export default defineConfig({
  // Served under the brand path https://www.danmercede.com/works/orion-on-the-clock/
  // (the hub Vercel-rewrites that path, prefix-stripped, to this project's .vercel.app).
  // `base` makes the emitted asset refs and favicons resolve under that path so the
  // proxied page is self-consistent.
  base: '/works/orion-on-the-clock/',
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  plugins: [react(), bodyBake()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
