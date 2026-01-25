'use client'

import { Canvas, useUniforms, useNodes, useLocalNodes, useFrame } from '@react-three/fiber/webgpu'
import { OrbitControls } from '@react-three/drei/webgpu'
import { Fn, vec3, sin, time, positionLocal, normalLocal } from 'three/tsl'
import { useRef } from 'react'

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

const UI = () => {
  const ref = useRef<HTMLDivElement>(null)

  useFrame(({ elapsed }) => {
    if (ref.current) {
      ref.current.innerText = `${elapsed.toFixed(2)}`
    }
  })

  return <div ref={ref} style={{ position: 'fixed', top: 20, right: 20 }} />
}

const IndexPage = () => (
  <>
    <Canvas style={{ height: '100vh' }}>
      <OrbitControls />
      <GlobalEffects />
      <WobblySphere />
    </Canvas>
    <UI />
  </>
)
export default IndexPage
