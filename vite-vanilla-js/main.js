import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'
import * as TSL from 'three/tsl'

console.log(TSL.sqrt(2))

const width = window.innerWidth
const height = window.innerHeight

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
camera.position.z = 1

const scene = new THREE.Scene()

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2)
const material = new THREE.MeshNormalMaterial()

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

const renderer = new WebGPURenderer({ antialias: true })
await renderer.init()
renderer.setSize(width, height)
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement)

console.log(renderer.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend')

function animate(time) {
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  renderer.render(scene, camera)
}
