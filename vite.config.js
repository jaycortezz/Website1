import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base is '/Website1/' for the GitHub Pages build, '/' for local dev.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === 'build' ? '/Website1/' : '/',
  server: { host: true, port: 5173 },
}))
