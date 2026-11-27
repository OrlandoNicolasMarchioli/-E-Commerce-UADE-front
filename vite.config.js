import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { cspPlugin } from './vite.csp.js'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // La CSP deja hacer fetch solo al propio sitio y a la API del back.
  const apiOrigin = new URL(env.VITE_API_URL || 'http://localhost:8080').origin

  return {
    plugins: [react(), cspPlugin({ apiOrigin })],
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['./src/test/setup.js'],
    },
  }
})
