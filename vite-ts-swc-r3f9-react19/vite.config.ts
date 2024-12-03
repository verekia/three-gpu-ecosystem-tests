import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  // You might not need those. They are needed when importing modules with
  // top-level await such as three/examples/jsm/capabilities/WebGPU
  optimizeDeps: { esbuildOptions: { target: 'esnext' } },
  build: { target: 'esnext' },
})
