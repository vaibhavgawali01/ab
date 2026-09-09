import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      },
      '/trains': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/routes': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/stations': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/replay': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/predict-delay': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/calculate-eta': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/conflicts': { target: 'http://127.0.0.1:8000', changeOrigin: true },
      '/analytics': { target: 'http://127.0.0.1:8000', changeOrigin: true }
    }
  }
})
