'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'
import { WebGPURenderer } from 'three/webgpu'
import * as TSL from 'three/tsl'
import WebGPU from 'three/examples/jsm/capabilities/WebGPU'

export function ClientCanvas({ children }) {
  useEffect(() => {
    console.log(WebGPU.isAvailable())
    console.log(TSL.sqrt(2))
  }, [])

  return (
    <Canvas
      style={{ height: '100vh' }}
      gl={canvas => {
        const renderer = new WebGPURenderer({ canvas })
        renderer.xr = { addEventListener: () => {} }
        return renderer
      }}
    >
      {children}
    </Canvas>
  )
}
