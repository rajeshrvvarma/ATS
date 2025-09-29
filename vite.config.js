import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the 'path' module from Node.js

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This 'resolve' block is the key to making path aliases work.
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

