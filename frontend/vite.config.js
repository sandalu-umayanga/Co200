import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // Specify the output directory
    rollupOptions: {
      input: './index.html', // Specify the entry point
    },
  },
  base: './', // Specify the base URL
})