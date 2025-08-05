import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { DOMAIN } from './src/setup/setup'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    cors: true,
    proxy: {
      '/socket.io': {
        // target: "https://web-admin-doantotnghiep.onrender.com",
        target: DOMAIN,
        ws: true
      }
    }
  },
  base: '/', // Thêm base URL
})
