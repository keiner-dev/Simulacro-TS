/// <reference types="vitest/config" />
// Importamos los plugins de React (para JSX/TSX), Tailwind y Vitest.
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
// Importamos path y fileURLToPath para resolver el alias "@/" de forma absoluta.
import { fileURLToPath, URL } from 'node:url'

// defineConfig exporta la configuración de Vite (y de Vitest, mediante el campo "test").
export default defineConfig({
  // Alias de imports: hace que "@/" apunte a la carpeta "./src".
  // Lo definimos explícitamente para que tanto Vite (build) como Vitest (tests)
  // resuelvan los imports tipo "@/components/..." correctamente.
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Plugins que usa la app: React (transforma JSX) y Tailwind CSS.
  plugins: [react(), tailwindcss()],
  // Configuración de Vitest (framework de pruebas).
  test: {
    // Globals: ponemos las funciones de vitest (describe, it, expect...) globales,
    // así no hace falta importarlas en cada archivo de test.
    globals: true,
    // Entorno jsdom: simula un navegador para poder probar componentes de React
    // (acceder a document, window, DOM, etc.).
    environment: 'jsdom',
    // setupFiles: archivo que se ejecuta ANTES de todos los tests. Lo usamos para
    // importar "@testing-library/jest-dom" (matchers como toBeInTheDocument).
    setupFiles: './src/test/setup.ts',
  },
})
