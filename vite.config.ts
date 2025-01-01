import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: 'localhost',
    hmr: true
  },
  preview: {
    port: 5173,
    strictPort: true,
    host: 'localhost',
  },
  build: {
    target: ['es2015', 'edge88', 'firefox78', 'chrome87', 'safari14'],
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  }
});
