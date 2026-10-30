import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

// El código fuente vive en /src y el build se genera en la RAÍZ del repo,
// para que GitHub Pages ("Deploy from a branch" → main / root) lo sirva directo.
export default defineConfig({
  root: fileURLToPath(new URL('./src', import.meta.url)),
  base: './',
  plugins: [react(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL('.', import.meta.url)),
    emptyOutDir: false,
  },
})
