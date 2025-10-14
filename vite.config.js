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
    // Set chunk size warning limit to 300kb instead of default 500kb
    chunkSizeWarningLimit: 300,
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
          // Group all React ecosystem packages into a single chunk
          if (
            id.includes('react') ||
            id.includes('react-dom') ||
            id.includes('react-router-dom') ||
            id.includes('framer-motion') ||
            id.includes('lucide-react') ||
            id.includes('react-icons')
          ) {
            return 'vendor-react';
          }
          // Firebase services (split into smaller chunks)
          if (id.includes('firebase/auth')) {
            return 'vendor-firebase-auth';
          }
          if (id.includes('firebase/firestore')) {
            return 'vendor-firebase-firestore';
          }
          if (id.includes('firebase/storage')) {
            return 'vendor-firebase-storage';
          }
          if (id.includes('firebase')) {
            return 'vendor-firebase-core';
          }
          
          // UI libraries (split by type)
          // (Handled above in vendor-react)
          
          // Chart and visualization libraries (split further)
          if (id.includes('chart.js')) {
            return 'vendor-chartjs';
          }
          if (id.includes('html2canvas')) {
            return 'vendor-canvas';
          }
          if (id.includes('jspdf')) {
            return 'vendor-pdf';
          }
          
          // Split React ecosystem more granularly (handled above)
          
          // AI services
          if (id.includes('@google/generative-ai') || id.includes('openai')) {
            return 'vendor-ai';
          }
          
          // Dashboard components (split into smaller chunks)
          if (id.includes('AdminDashboard') || id.includes('admin')) {
            return 'dashboard-admin';
          }
          if (id.includes('StudentDashboard') || id.includes('student')) {
            return 'dashboard-student';
          }
          if (id.includes('InstructorDashboard') || id.includes('instructor')) {
            return 'dashboard-instructor';
          }
          if (id.includes('Dashboard') || id.includes('analytics') || id.includes('gamification')) {
            return 'dashboard-common';
          }
          
          // Learning components (split by feature)
          if (id.includes('VideoLearning') || id.includes('VideoLesson')) {
            return 'learning-video';
          }
          if (id.includes('quiz') || id.includes('Quiz')) {
            return 'learning-quiz';
          }
          if (id.includes('learning') || id.includes('Learning')) {
            return 'learning-core';
          }
          
          // Landing pages (split by category)
          if (id.includes('BootcampLanding') || id.includes('MasteryLanding')) {
            return 'pages-courses';
          }
          if (id.includes('HomePage') || id.includes('Contact') || id.includes('About')) {
            return 'pages-marketing';
          }
          
          // Services (split by functionality)
          if (id.includes('reportingService') || id.includes('analyticsService')) {
            return 'services-analytics';
          }
          if (id.includes('notificationService') || id.includes('emailService')) {
            return 'services-communication';
          }
          if (id.includes('paymentService') || id.includes('phonepe')) {
            return 'services-payment';
          }
          
          // Node modules that are frequently updated
          if (id.includes('node_modules')) {
            // Split large node_modules into separate chunks
            if (id.includes('node_modules/@firebase')) {
              return 'vendor-firebase-sdk';
            }
            if (id.includes('node_modules/react-')) {
              return 'vendor-react-ecosystem';
            }
            return 'vendor-others';
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

