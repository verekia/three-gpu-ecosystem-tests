'use client'

import { useEffect, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'

export function ClientBox(props) {
  const meshRef = useRef()
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const { gl } = useThree()

  useFrame((state, delta) => (meshRef.current.rotation.x += delta))

  useEffect(() => {
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
