import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Emit source maps so the minified bundle stays debuggable in production.
    sourcemap: true,
  },
})
