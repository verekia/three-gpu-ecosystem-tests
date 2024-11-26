import { useEffect } from 'react'
// @ts-ignore
import * as THREE from 'three'
// @ts-ignore
import { WebGPURenderer } from 'three/webgpu'
// @ts-ignore
import * as TSL from 'three/tsl'
// @ts-ignore
import WebGPU from 'three/examples/jsm/capabilities/WebGPU'

console.log(WebGPU.isAvailable())
console.log(TSL.sqrt(2))

function App() {
  useEffect(() => {
    const width = window.innerWidth,
      height = window.innerHeight

    const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
    camera.position.z = 1

    const scene = new THREE.Scene()

    const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
    const material = new THREE.MeshNormalMaterial()

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new WebGPURenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setAnimationLoop(animate)
    document.body.appendChild(renderer.domElement)

    function animate(time: number) {
      mesh.rotation.x = time / 2000
      mesh.rotation.y = time / 1000

      renderer.render(scene, camera)
    }
  }, [])

  return null
}

export default App
