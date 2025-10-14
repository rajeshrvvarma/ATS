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
  // Optimization for react-icons tree-shaking
  optimizeDeps: {
    include: ['react-icons/fc'],
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
        },
        // PERFORMANCE FIX: Manual chunk splitting for better loading
        manualChunks: (id) => {
          // Core React and React Router
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'vendor-react';
          }
          // Firebase services (largest dependency)
          if (id.includes('firebase')) {
            return 'vendor-firebase';
          }
          // UI libraries
          if (id.includes('lucide-react') || id.includes('react-icons')) {
            return 'vendor-ui';
          }
          // AI services
          if (id.includes('@google/generative-ai') || id.includes('openai')) {
            return 'vendor-ai';
          }
          // Dashboard components
          if (id.includes('Dashboard') || id.includes('analytics') || id.includes('gamification')) {
            return 'dashboard';
          }
          // Learning components
          if (id.includes('VideoLearning') || id.includes('VideoLesson') || id.includes('quiz')) {
            return 'learning';
          }
          // Default chunk for everything else
          return undefined;
        }
      }
    }
  },
  // Ensure PWA files are served correctly in development
  publicDir: 'public'
});

