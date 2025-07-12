import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: './src',
  plugins: [react()],
  server: {
    port: 3001,
    strictPort: true,
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    sourcemap: true,
  },
  css: {
    postcss: './postcss.config.cjs',
  },
});