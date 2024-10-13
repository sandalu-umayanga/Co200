import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // The output directory for the build
  },
  // Optionally, set public directory if you have static assets
  publicDir: 'public',
});
