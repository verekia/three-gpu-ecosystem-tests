# Three.js WebGPU Ecosystem Integration Test Suite

This is a collection of tests that incrementally add complexity to the setup. Testing is done with Three.js development versions that are between r170 and r171. All tests use **WebGPURenderer** and call a **TSL** function.

Testing goes from Vite vanilla JS all the way to TS + React + React Three Fiber + Next.js (Pages and App routers).

This is the behavior expected for the upcoming Three.js r171 release.

## How to test

Go to a folder, like `next15-pages-vanilla-react19`.

If you have Docker installed:

- `npm run docker` to build and run the app in production mode (uses Node 20, where `navigator` is not defined).

Otherwise, to test with your local Node.js version:

1. `npm i`. (you might need `--legacy-peer-deps` with React 19 RC, check the Dockerfile)
2. `npm run dev` to check how it works in development.
3. `npm run start` to check how it works in production.

## Results

Tested with the `dev` branch at commit [**a0a25ea**](https://github.com/mrdoob/three.js/commit/a0a25ea032029951ba50622be4277af87170feaa) (2024-11-26, before the release of r171).

A ✅ means the scene renders, and the project works in dev mode, and in production.

- `next14-app-r3f8-react18`: ✅
- `next14-pages-r3f8-react18`: ✅
- `next15-app-r3f8-react18`: ❌ [`ReactCurrentOwner` error](#reactcurrentowner-issue)
- `next15-app-r3f9-react19`: ✅
- `next15-app-r3f9-react19-rsc`: ✅ - see [this note](#react-server-components-with-r3f) about RSCs
- `next15-app-vanilla-react19`: ✅
- `next15-pages-vanilla-react19`: ✅
- `vite-ts-swc-r3f8-react18`: ✅
- `vite-ts-swc-r3f9-react19`: ✅
- `vite-vanilla-js`: ✅

### Non-blocking issues

- ⚠️ Importing a module with top-level await such as `three/examples/jsm/capabilities/WebGPU.js` requires a [Vite config change and causes warnings in Next.js](#top-level-await-issues).

- ⚠️ React Three Fiber with WebGPURenderer always causes a [render warning](#r3f-render-called-before-backend-initialized-issue).

- ⚠️ Using React Three Fiber with React 19 RC requires installing with `npm i --legacy-peer-deps`.

- ⚠️ Using R3F v9 requires a [fix when initializing the canvas](#react-three-fiber-v9-xr-issue).

### Next.js 15, Pages Router, vanilla Three.js, React 19 RC

Dev & Prod: ✅

### Next.js 15, App Router (use client), vanilla Three.js, React 19 RC

Dev & Prod: ✅

### Next.js 15, Pages Router, R3F, React 18

Next.js 15 should be used with React 19 RC, but there are incompatible dependencies with R3F. Forcing react@18.3.1 in this case. Next.js issues are expected.

Dev & Prod: ⚠️

> [HMR] Invalid message: {"action":"appIsrManifest","data":{}} - TypeError: Cannot read properties of undefined (reading 'pathname')

> THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 15, Pages Router, R3F, React 19 RC

❌ `TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')`

### Next.js 15, Pages Router, R3F v9, React 19 RC

Dev & Prod: ✅ ⚠️

> [HMR] Invalid message: {"action":"appIsrManifest","data":{}}
> .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 15, App Router, R3F v9, React 19 RC

Dev & Prod: ✅ ⚠️

> .render() called before the backend is initialized. Try using .renderAsync() instead.

### React Server Components with R3F

You can use React Server Components with R3F. This actually works without `'use client'`:

```js
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
```

`ClientCanvas`, `ClientBox`, and `ClientOrbitControls` are marked with `'use client'`. You can interweave server and client components this way, but expect this approach to be pretty painful.

## Top-level Await issues

Some Three.js modules, like `three/examples/jsm/capabilities/WebGPU`, contain top-level await statements.

### Vite

Importing a module with top-level await will give you this error:

❌ `Top-level await is not available in the configured target environment`

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
  ▲ Next.js 14.2.18

 ✓ Linting and checking validity of types
   Creating an optimized production build ...
 ⚠ Compiled with warnings

./node_modules/three/examples/jsm/capabilities/WebGPU.js
The generated code contains 'async/await' because this module is using "topLevelAwait".
However, your target environment does not appear to support 'async/await'.
As a result, the code may not run as expected or may cause runtime errors.

Import trace for requested module:
./node_modules/three/examples/jsm/capabilities/WebGPU.js

 ✓ Compiled successfully
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

### R3F render called before backend initialized issue

This warning is caused by using R3F with WebGPURenderer.

THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.

### React Three Fiber v9 XR issue

If you use R3F v9, you will get this error on your Canvas:

❌ `TypeError: gl.xr.addEventListener is not a function`

It can be fixed with:

```jsx
<Canvas
  gl={canvas => {
    const renderer = new WebGPURenderer({ canvas })
    renderer.xr = { addEventListener: () => {} }
    return renderer
  }}
>
```

### ReactCurrentOwner issue

In the browser, there is this error:

❌ `TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')`

Also a related error during builds:

❌ Cannot read properties of undefined (reading 'ReactCurrentBatchConfig')

It seems like React Three Fiber 8 is not compatible with Next.js 15 or React 19 RC in some circumstances.

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
