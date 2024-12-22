import * as THREE from "three";
import { WebGPURenderer } from "three/webgpu";
import * as TSL from "three/tsl";
import { MeshBasicNodeMaterial } from "three/webgpu";

// This is a checkerboard pattern from material x made into tsl
//input: color1, color2, uvtiling, uvoffset
const color1 = TSL.uniform(new THREE.Color(1, 0, 0));
const color2 = TSL.uniform(new THREE.Color(0, 1, 0));
const uvtiling = TSL.uniform(new THREE.Vector2(8, 8));
const uvoffset = TSL.uniform(new THREE.Vector2(0, 0));
const mix = TSL.uv().mul(uvtiling).sub(uvoffset).floor().dot(1).mod(2);

const output = TSL.mix(color1, color2, mix);

//output: color3

const width = window.innerWidth;
const height = window.innerHeight;

const camera = new THREE.PerspectiveCamera(70, width / height, 0.01, 10);
camera.position.z = 1;

const scene = new THREE.Scene();

const geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
const material = new MeshBasicNodeMaterial();
material.colorNode = output;

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const renderer = new WebGPURenderer({ antialias: true });
await renderer.init();
renderer.setSize(width, height);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

console.log(
    renderer.backend.isWebGPUBackend ? "WebGPU Backend" : "WebGL Backend"
);

function animate(time) {
    mesh.rotation.x = time / 2000;
    mesh.rotation.y = time / 1000;

    renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
});
