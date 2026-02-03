import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/hello/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    // Optimize for Raspberry Pi 5
    target: 'es2020',
    minify: 'terser',
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
  },
  // Optimize dev server for low-resource environments
  server: {
    hmr: {
      overlay: false,
    },
  },
})
