import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const DOMAIN = 'http://160.191.51.75:3000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    cors: true,
  },
  preview: {
    port: 5173,
    host: '0.0.0.0'
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    define: {
      'process.env.VITE_API_URL': JSON.stringify(DOMAIN)
    }
  }
})
