'use client'

import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { WebGPURenderer } from 'three/webgpu'

export function ClientCanvas({ children }) {
  return (
    <Canvas
      style={{ height: '100vh' }}
      gl={async (glProps) => {
        console.log(glProps)
        const renderer = new WebGPURenderer(glProps)
        await renderer.init()
        return renderer
      }}
    >
      {children}
    </Canvas>
  )
}
