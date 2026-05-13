import { defineConfig, loadEnv } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL || env.VITE_TEST_API_URL || 'http://localhost:4000/api'
  const apiUrl = new URL(apiBaseUrl)
  const apiPath = apiUrl.pathname.replace(/\/$/, '')

  return {
    plugins: [
      react(),
      babel({ presets: [reactCompilerPreset()] })
    ],
    server: {
      proxy: {
        '/api': {
          target: apiUrl.origin,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, apiPath)
        }
      }
    }
  }
})
