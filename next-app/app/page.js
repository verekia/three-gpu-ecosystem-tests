'use client'

import { Canvas, useUniforms, useNodes, useLocalNodes } from '@react-three/fiber/webgpu'
import { OrbitControls } from '@react-three/drei/core'
import { Fn, vec3, sin, time, positionLocal, normalLocal } from 'three/tsl'

const GlobalEffects = () => {
  useNodes(() => ({
    wobble: Fn(() => vec3(sin(time), sin(time.mul(1.3)), sin(time.mul(2)))),
  }))

  return null
}

const WobblySphere = () => {
  const { uIntensity } = useUniforms({ uIntensity: 0.5 })

  const { displacement } = useLocalNodes(({ nodes }) => ({
    displacement: nodes.wobble().mul(uIntensity),
  }))

  return (
    <mesh>
      <sphereGeometry />
      <meshBasicNodeMaterial positionNode={positionLocal.add(normalLocal.mul(displacement))} color="red" />
    </mesh>
  )
}
const IndexPage = () => (
  <Canvas style={{ height: '100vh' }}>
    <OrbitControls />
    <GlobalEffects />
    <WobblySphere />
  </Canvas>
)
export default IndexPage