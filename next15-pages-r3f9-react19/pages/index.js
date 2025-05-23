import React, { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { WebGPURenderer } from 'three/webgpu'
import { uniform } from 'three/tsl'
import { Color } from 'three'

const red = new Color('red')
const blue = new Color('blue')

process.env.NODE_ENV === 'development' &&
  console.log(
    'The appIsrManifest error is fixed in Next.js 15.1.1-canary.24 (not merged into the main release yet)'
  )

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
  return (
    <Canvas
      style={{ height: '100vh' }}
      gl={async (glProps) => {
        const renderer = new WebGPURenderer(glProps)
        await renderer.init()
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
