import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/rohrman-ade-platform/',
  plugins: [
    tailwindcss(),
    react(),
  ],
  server: {
    port: 5189,
    open: true
  }
})
