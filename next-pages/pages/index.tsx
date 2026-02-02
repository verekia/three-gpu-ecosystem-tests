import { Canvas, useUniforms, useNodes, useLocalNodes, useFrame, useRenderPipeline } from '@react-three/fiber/webgpu'
import { OrbitControls } from '@react-three/drei/core'
import { Fn, vec3, sin, time, positionLocal, normalLocal } from 'three/tsl'
import { bloom } from 'three/addons/tsl/display/BloomNode.js'
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
      <meshLambertNodeMaterial
        positionNode={positionLocal.add(normalLocal.mul(displacement))}
        color="red"
        emissive="white"
        emissiveIntensity={0.7}
      />
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

const PostProcessing = () => {
  useRenderPipeline(({ renderPipeline, passes }) => {
    const sceneTexture = passes.scenePass.getTextureNode()
    renderPipeline.outputNode = sceneTexture.add(bloom(sceneTexture, 0.5, 0.1, 0.9))
  })

  return null
}

const IndexPage = () => (
  <>
    <Canvas>
      <OrbitControls />
      <GlobalEffects />
      <WobblySphere />
      <ambientLight intensity={3} />
      <directionalLight position={[5, 5, 3]} intensity={3} />
      <PostProcessing />
    </Canvas>
    <UI />

    <style>{`
      html, body, canvas, #__next { height: 100% }
      body { margin: 0; background: black; }
    `}</style>
  </>
)

export default IndexPage
