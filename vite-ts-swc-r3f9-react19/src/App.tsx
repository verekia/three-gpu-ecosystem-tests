import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { WebGPURenderer } from 'three/webgpu'
import type { Mesh } from 'three'
import * as TSL from 'three/tsl'

function Box(props: any) {
  const meshRef = useRef<Mesh>(null!)
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const { gl } = useThree()

  useFrame((_, delta) => (meshRef.current.rotation.x += delta))

  // @ts-expect-error
  console.log(gl.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend')

  useEffect(() => {
    console.log(TSL.sqrt(2))
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

export default function App() {
  const [frameloop, setFrameloop] = useState<'never' | 'always'>('never')

  return (
    <Canvas
      style={{ height: '100vh' }}
      frameloop={frameloop}
      gl={(canvas) => {
        const renderer = new WebGPURenderer({
          // @ts-expect-error
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
