'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useState } from 'react'
import { WebGPURenderer } from 'three/webgpu'
import * as TSL from 'three/tsl'

export function ClientCanvas({ children }) {
  const [frameloop, setFrameloop] = useState('never')

  useEffect(() => {
    console.log(TSL.sqrt(2))
  }, [])

  return (
    <Canvas
      style={{ height: '100vh' }}
      frameloop={frameloop}
      gl={canvas => {
        const renderer = new WebGPURenderer({
          canvas,
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
        })
        renderer.init().then(() => setFrameloop('always'))
        renderer.xr = { addEventListener: () => {} }
        return renderer
      }}
    >
      {children}
    </Canvas>
  )
}
