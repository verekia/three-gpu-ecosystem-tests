# Three.js WebGPU Ecosystem Integration Test Suite

This is a collection of tests that incrementally add complexity to the setup. Testing is done with Three.js **r173** (2025-01-31). All tests use **WebGPURenderer**, a call a **TSL** function, and a test of the graphics backend type used. With vanilla [Three.js](https://threejs.org/), [React Three Fiber](https://r3f.docs.pmnd.rs/), and [Threlte](https://threlte.xyz/).

## How to test

Go to a folder, like `next15-pages-vanilla-react19`.

If you have Docker installed:

- `npm run docker` to build and run the app in production mode.

> The Docker image uses Node 20, before `navigator` was added in Node 21.

Otherwise, to test with your local Node.js version:

1. `npm i` (you might need `--legacy-peer-deps` React 19)
2. `npm run dev` to check how it works in development.
3. `npm run start` to check how it works in production.

## Results

A ✅ means the scene renders, and the project works in dev mode, and in production.

- `next14-app-r3f8-react18`: ✅
- `next14-pages-r3f8-react18`: ✅
- `next15-app-r3f9-react19`: ✅
- `next15-app-r3f9-react19-rsc`: ✅ See [this note](#react-server-components-with-r3f) about RSCs
- `next15-pages-r3f9-react19`: ✅ Unrelated Next.js [HMR warning](#hmr-appisrmanifest-issue)
- `next15-pages-vanilla-react19`: ✅
- `sveltekit-threlte8`: ✅
- `vite-ts-swc-r3f8-react18`: ✅
- `vite-ts-swc-r3f9-react19`: ✅
- `vite-ts-threlte8`: ✅
- `vite-vanilla-js`: ✅

### Non-blocking issues

- ⚠️ Importing a module with top-level await such as `three/examples/jsm/capabilities/WebGPU.js` requires a [Vite config change and causes warnings in Next.js](#top-level-await-issues).

- ⚠️ WebGPURenderer is initialized with WebGPUBackend before falling back to WebGLBackend. You should [await the init method](#testing-the-backend-type) before checking the backend type or if your wrapper such as R3F tries to render before the backend is initialized. With R3F, you can use `frameloop="never"` to delay the first render call. If you don't, you will get this [render warning](#r3f-render-called-before-backend-initialized-issue).

- ⚠️ Using React Three Fiber with React 19 requires installing with `npm i --legacy-peer-deps`.

### Removed test cases

The following test cases are less relevant now:

- `next15-app-r3f8-react18`: ❌ [`ReactCurrentOwner` error](#reactcurrentowner-issue)
- `next15-app-vanilla-react19`: ✅
- `next15-pages-r3f8-react18`: ✅ Unrelated Next.js [HMR warning](#hmr-appisrmanifest-issue)
- `next15-pages-r3f8-react19`: ❌ [`ReactCurrentOwner` error](#reactcurrentowner-issue)

## Renderer defaults

React Three Fiber normally creates a WebGLRenderer with [these defaults](https://r3f.docs.pmnd.rs/api/canvas#defaults) ([see the code](https://github.com/pmndrs/react-three-fiber/blob/261ee123fcb717be3bd3278f5b432156e1c7b483/packages/fiber/src/core/index.tsx#L113)). Same thing with [Threlte](https://github.com/threlte/threlte/blob/fbc229a52d0bab4a5a0b03b21a2e9849ff6764bc/packages/core/src/lib/lib/useRenderer.ts#L33). For a similar setup with WebGPURenderer, pass the same parameters to the WebGPURenderer constructor:

```js
const renderer = new WebGPURenderer({
  canvas,
  powerPreference: 'high-performance',
  antialias: true,
  alpha: true,
})
```

## Top-level Await issues

Some Three.js modules, like `three/examples/jsm/capabilities/WebGPU`, contain top-level await statements.

### Vite

Importing a module with top-level await will give you this error:

> ❌ `Top-level await is not available in the configured target environment`

Add this to your `vite.config.js`:

```js
import { defineConfig } from 'vite'

export default defineConfig({
  optimizeDeps: { esbuildOptions: { target: 'esnext' } },
  build: { target: 'esnext' },
})
```

One of the options fixes development mode, the other fixes production.

### Next.js

Importing a module with top-level await will give you this warning in the browser console and when compiling:

```
./node_modules/three/examples/jsm/capabilities/WebGPU.js
The generated code contains 'async/await' because this module is using "topLevelAwait".
However, your target environment does not appear to support 'async/await'.
As a result, the code may not run as expected or may cause runtime errors.
```

### R3F render called before backend initialized issue

This warning is caused by using R3F with WebGPURenderer.

> ⚠️ `THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.`

There is a workaround:

```jsx
const [frameloop, setFrameloop] = useState('never')

<Canvas
  frameloop={frameloop}
  gl={(canvas) => {
    const renderer = new WebGPURenderer({ canvas })
    renderer.init().then(() => setFrameloop('always'))
    return renderer
  }}
/>
```

## SSR issues with Next.js and Node.js

Next.js uses Node.js to Server-Side Render pages on the server. When importing modules on the server, if those modules reference global browser objects like `window`, `document`, `self`, or `navigator` at the top level, you will get a compilation error. _Except_ for `navigator`, which got [added to Node.js 21](https://nodejs.org/en/blog/announcements/v21-release-announce#navigator-object-integration).

Those top-level references are being tracked down in Three.js for better Next.js support, and this repository is also meant to help testing those issues.

Generally speaking, as a Next.js developer working with libraries that are meant for browsers like Three.js, it is safer to execute browser-only code inside `useEffect` hooks or similar. See [this article](https://www.joshwcomeau.com/react/the-perils-of-rehydration/).

```js
import { browserOnlyFunction } from 'three'

browserOnlyFunction() // ❌ Don't do that, it runs on the server during SSR

function MyComponent() {
  browserOnlyFunction() // ❌ Don't do that, it runs on the server during SSR

  useEffect(() => {
    browserOnlyFunction() // ✅ No problem, runs only in the browser
  }, [])

  return // ...
}
```

### ReactCurrentOwner issue

It seems like React Three Fiber 8 is not compatible with Next.js 15 or React 19 in some circumstances.

> ❌ `TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')`

Also a related error during builds:

> ❌ Cannot read properties of undefined (reading 'ReactCurrentBatchConfig')

### React Server Components with R3F

You can use React Server Components with R3F. This actually works without `'use client'`:

```js
<ClientCanvas>
  <ClientOrbitControls />
  <ClientBox position={[-1.2, 0, 0]} />
  <ClientBox position={[1.2, 0, 0]} />

  <ambientLight intensity={Math.PI / 2} />
  <spotLight
    position={[10, 10, 10]}
    angle={0.15}
    penumbra={1}
    decay={0}
    intensity={Math.PI}
  />
  <pointLight position={[-10, -10, -10]} decay={0} intensity={Math.PI} />
  <mesh>
    <boxGeometry />
    <meshStandardMaterial color="red" />
  </mesh>
</ClientCanvas>
```

`ClientCanvas`, `ClientBox`, and `ClientOrbitControls` are marked with `'use client'`. You can interweave server and client components this way, but expect this approach to be pretty painful.

### HMR appIsrManifest issue

> ⚠️ `[HMR] Invalid message: {"action":"appIsrManifest","data":{}}`

> `TypeError: Cannot read properties of undefined (reading 'pathname')`

[Issue on Next.js repo](https://github.com/vercel/next.js/issues/71974).

**Fixed in `15.1.1-canary.24`.**

## Testing the backend type

WebGPURenderer initially reports WebGPUBackend before falling back to WebGLBackend ([issue](https://github.com/mrdoob/three.js/issues/30024)). There are workarounds for it.

With vanilla Three.js:

```js
renderer = new THREE.WebGPURenderer()
await renderer.init()
console.log(renderer.backend) // WebGPUBackend or WebGLBackend
```

With React Three Fiber:

```js
const [frameloop, setFrameloop] = useState('never')

<Canvas
  frameloop={frameloop}
  gl={(canvas) => {
    const renderer = new WebGPURenderer({ canvas })
    renderer.init().then(() => setFrameloop('always'))
    return renderer
  }}
/>
```

If checking the backend type is not critical (for example you just want to see which one is used when developing locally) you can use a `setTimeout` to keep things simple:

```js
setTimeout(() => {
  console.log(
    renderer.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend'
  )
}, 1000)
```

## Drei Compatibility

You should also expect to only be able to use a subset of [Drei](https://github.com/pmndrs/drei) and the Three.js ecosystem with WebGPU, since some libraries and composants are written in GLSL.

The following Drei components have been tested with R3F + WebGPU:

- ✅ BakeShadows
- ✅ Billboard
- ✅ Bvh
- ✅ FlyControls
- ✅ GradientTexture
- ✅ Html
- ✅ Instances
- ✅ KeyboardControls
- ✅ MapControls
- ✅ Merged
- ✅ OrbitControls
- ✅ OrthographicCamera
- ✅ Stats
- ✅ StatsGl

- ❌ Edges: `TypeError: Failed to execute 'drawIndexed' on 'GPURenderPassEncoder': Value is infinite and not of type 'unsigned long'.`
- ❌ MeshTransmissionMaterial
- ❌ Outlines: `NodeMaterial: Material "ShaderMaterial" is not compatible.`
- ❌ Text: `TypeError: Failed to execute 'drawIndexed' on 'GPURenderPassEncoder': Value is infinite and not of type 'unsigned long'.`
- ❌ Wireframe: Nothing shows up + `Requires non-indexed geometry, converting to non-indexed geometry.`

You can run one of the R3F test cases of this repo and help complete the list. Don't commit code, just edit this README with the results of your tests.

## Minimal Vanilla Three.js + TSL Example

```js
import { mix, vec3, uv } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

const red = vec3(1, 0, 0)
const green = vec3(0, 1, 0)
const checkerboard = uv().mul(8).floor().dot(1).mod(2)
const colorNode = mix(red, green, checkerboard)

const material = new MeshBasicNodeMaterial()
material.colorNode = colorNode
```

## Minimal R3F9 + TS + TSL Example

```tsx
import { extend, type ThreeElement } from '@react-three/fiber'
import { mix, positionLocal, sin, time, vec3 } from 'three/tsl'
import { MeshBasicNodeMaterial } from 'three/webgpu'

const red = vec3(1, 0, 0)
const blue = vec3(0, 0, 1)
const currentTime = time.mul(0.5)
const colorNode = mix(red, blue, sin(currentTime))
const positionNode = positionLocal.add(vec3(0, sin(currentTime).mul(0.2), 0))

extend({ MeshBasicNodeMaterial })

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshBasicNodeMaterial: ThreeElement<typeof MeshBasicNodeMaterial>
  }
}

const Plane = () => (
  <mesh scale={5}>
    <planeGeometry />
    <meshBasicNodeMaterial colorNode={colorNode} positionNode={positionNode} />
  </mesh>
)
```
