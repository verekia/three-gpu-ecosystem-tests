import * as THREE from 'three'
import { WebGPURenderer } from 'three/webgpu'

const width = window.innerWidth
const height = window.innerHeight

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10)
camera.position.z = 1

const scene = new THREE.Scene()

const geometry = new THREE.BufferGeometry()

const vertices = new Float32Array([
  -0.1, -0.1, 0.1, 0.1, -0.1, 0.1, 0.1, 0.1, 0.1, -0.1, 0.1, 0.1, -0.1, -0.1,
  -0.1, 0.1, -0.1, -0.1, 0.1, 0.1, -0.1, -0.1, 0.1, -0.1,
])

const colors = new Float32Array([
  1, 0, 0, 0.5, 1, 0, 0, 0.5, 1, 0, 0, 0.5, 1, 0, 0, 0.5, 0, 1, 0, 0.5, 0, 1, 0,
  0.5, 0, 1, 0, 0.5, 0, 1, 0, 0.5,
])

const indices = new Uint16Array([
  0, 1, 2, 0, 2, 3, 1, 5, 6, 1, 6, 2, 5, 4, 7, 5, 7, 6, 4, 0, 3, 4, 3, 7, 3, 2,
  6, 3, 6, 7, 4, 5, 1, 4, 1, 0,
])

geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 4)) // Using 4 components for RGBA
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

const material = new THREE.MeshLambertMaterial({
  vertexColors: true,
  transparent: true,
  depthWrite: false,
  side: THREE.DoubleSide,
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Doesn't work with WebGPURenderer:
const renderer = new WebGPURenderer({ antialias: true })
await renderer.init()

// Works with WebGLRenderer:
// const renderer = new THREE.WebGLRenderer({ antialias: true })
// renderer.setClearColor(0xffffff)

renderer.setSize(width, height)
renderer.setAnimationLoop(animate)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight(0xffffff, 10)
scene.add(ambientLight)

function animate(time) {
  mesh.rotation.x = time / 2000
  mesh.rotation.y = time / 1000

  renderer.render(scene, camera)
}
