'use client'

import React, { useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { WebGPURenderer, MeshStandardNodeMaterial } from 'three/webgpu'
import { uniform } from 'three/tsl'
import { Color } from 'three'

extend({ MeshStandardNodeMaterial })

const red = new Color('red')
const blue = new Color('blue')

function Box(props) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const { gl } = useThree()

  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  console.log(gl.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend')

  const uColor = useMemo(() => uniform(blue), [])

  uColor.value = hovered ? red : blue

  return (
    <mesh
      {...props}
      ref={meshRef}
      scale={active ? 1.5 : 1}
      onClick={() => setActive(!active)}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardNodeMaterial colorNode={uColor} />
    </mesh>
  )
}

export default function IndexPage() {
  const [frameloop, setFrameloop] = useState('never')

  return (
    <Canvas
      style={{ height: '100vh' }}
      frameloop={frameloop}
      gl={(canvas) => {
        const renderer = new WebGPURenderer({
          canvas,
          powerPreference: 'high-performance',
          antialias: true,
          alpha: true,
        })
        renderer.init().then(() => setFrameloop('always'))
        return renderer
      }}
    >
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight
        position={[10, 10, 10]}
        angle={0.15}
        penumbra={1}
        decay={0}
        intensity={Math.PI}
      />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
