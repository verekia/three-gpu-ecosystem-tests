'use client'

import { Canvas } from '@react-three/fiber/webgpu'
import { OrbitControls } from '@react-three/drei/core'

const IndexPage = () => (
  <Canvas style={{ height: '100vh' }}>
    <OrbitControls />
    <mesh>
      <boxGeometry />
      <meshBasicMaterial color="red" />
    </mesh>
  </Canvas>
)

export default IndexPage

