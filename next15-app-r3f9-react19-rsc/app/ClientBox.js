'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { MeshStandardNodeMaterial } from 'three/webgpu'
import { uniform } from 'three/tsl'
import { Color } from 'three'

extend({ MeshStandardNodeMaterial })

const red = new Color('red')
const blue = new Color('blue')

export function ClientBox(props) {
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
