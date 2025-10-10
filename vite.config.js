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
    target: 'esnext',
    rollupOptions: {
      // Ensure these files are copied as-is to the output directory
      external: [],
      output: {
        // Ensure service worker and manifest maintain their names and locations
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'sw.js' || assetInfo.name === 'manifest.json' || assetInfo.name === 'offline.html') {
            return '[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        }
      }
    }
  },
  // Ensure PWA files are served correctly in development
  publicDir: 'public'
});

