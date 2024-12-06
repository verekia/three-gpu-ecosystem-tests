import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

export default defineConfig({
  plugins: [svelte()],
  // Those are needed when importing modules with top-level
  // await such as three/examples/jsm/capabilities/WebGPU
  // optimizeDeps: { esbuildOptions: { target: 'esnext' } },
  // build: { target: 'esnext' },
})
