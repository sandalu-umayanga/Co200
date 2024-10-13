import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: '.', // Explicitly set the root directory
  plugins: [react()],
  build: {
    outDir: 'dist', // Output directory for build files
    emptyOutDir: true, // Clear the output directory before building
  },
  publicDir: 'public', // Public directory for static assets
});