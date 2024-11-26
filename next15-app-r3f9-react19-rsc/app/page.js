import React from 'react'

import { ClientBox } from './ClientBox'
import { ClientCanvas } from './ClientCanvas'
import { ClientOrbitControls } from './ClientOrbitControls'

export default function IndexPage() {
  return (
    <ClientCanvas>
      <ClientOrbitControls />
      <ClientBox position={[-1.2, 0, 0]} />
      <ClientBox position={[1.2, 0, 0]} />

      <ambientLight intensity={Math.PI / 2} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} decay={0} intensity={Math.PI} />
      <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="red" />
      </mesh>
    </ClientCanvas>
  )
}
