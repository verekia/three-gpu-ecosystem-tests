import { defineConfig } from 'vite'

export default defineConfig({
  // You might not need those. They are needed when importing modules with
  // top-level await such as three/examples/jsm/capabilities/WebGPU,
  // or if you use top-level await in your own code (which is the case here,
  // because we await renderer.init() in main.js).
  optimizeDeps: { esbuildOptions: { target: 'esnext' } },
  build: { target: 'esnext' },
})
