import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Backend the dev server forwards /api to. The browser only ever talks to
  // the Vite origin, so this works from localhost and from any LAN device
  // without hardcoding an IP or needing CORS.
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:5000'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: true, // listen on all interfaces (localhost + LAN IP)
      port: 5173,
      proxy: {
        '/api': { target: proxyTarget, changeOrigin: true },
      },
    },
  }
})
