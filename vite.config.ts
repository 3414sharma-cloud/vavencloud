import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// One React app (index.html → src/main.tsx); React Router serves every page. The dev and preview servers send
// every path to index.html, so /team/ or /sla/ open directly. Production hosting must do the same (see README).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    rolldownOptions: {
      output: {
        // The libraries (React, React Router, Lenis) in a file of their own: they change far less often than the
        // site, so a visitor's browser keeps them cached across releases
        codeSplitting: { groups: [{ name: 'vendor', test: /[\\/]node_modules[\\/]/ }] },
      },
    },
  },
})
