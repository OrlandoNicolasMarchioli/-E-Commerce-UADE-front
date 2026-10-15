import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  root: '.',
  build: {
    outDir: 'dist-demo',
    rollupOptions: {
      input: 'demo.html',
    },
  },
  server: {
    port: 5174,
    open: '/demo.html',
  },
});
