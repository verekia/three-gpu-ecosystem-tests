'use client'

import { Canvas } from '@react-three/fiber'
import { WebGPURenderer } from 'three/webgpu'
import '../lib/extend'

export function ClientCanvas({ children }) {
  return (
    <Canvas
      style={{ height: '100vh' }}
      gl={async (glProps) => {
        const renderer = new WebGPURenderer(glProps)
        await renderer.init()
        return renderer
      }}
    >
      {children}
    </Canvas>
  )
}
