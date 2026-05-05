import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE is set by the GitHub Actions deploy workflow to '/repo-name/'.
// Locally it is unset, so the app is served from '/'.
const base = process.env.VITE_BASE ?? '/'

export default defineConfig({
  base,
  plugins: [react()],
  optimizeDeps: {
    include: ['three', '@react-three/fiber', '@react-three/drei', '@react-three/postprocessing'],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
