import React, { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { WebGPURenderer } from 'three/webgpu'
import * as TSL from 'three/tsl'
import WebGPU from 'three/examples/jsm/capabilities/WebGPU'

function Box(props) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const { gl } = useThree()

  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  useEffect(() => {
    console.log(WebGPU.isAvailable())
    console.log(TSL.sqrt(2))

    // https://github.com/verekia/three-gpu-ecosystem-tests#testing-the-backend-type
    setTimeout(() => {
      // @ts-expect-error
      console.log(gl.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend')
    }, 1000)
  }, [])

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
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  )
}

export default function IndexPage() {
  return (
    <Canvas
      style={{ height: '100vh' }}
      gl={canvas => {
        const renderer = new WebGPURenderer({ canvas })
        renderer.xr = { addEventListener: () => {} }
        return renderer
      }}
    >
      <OrbitControls />
      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  )
}
