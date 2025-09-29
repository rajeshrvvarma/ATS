import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // This build configuration is the critical fix.
  // It ensures the build targets modern browsers that support import.meta.env.
  build: {
    target: 'esnext'
  }
});

