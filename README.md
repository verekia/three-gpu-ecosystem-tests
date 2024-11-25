# Three.js WebGPU Ecosystem Integration Test Suite

This is a collection of tests that incrementally add complexity to the setup. Testing is done with Three.js development versions that are between r170 and r171. All tests use **WebGPURenderer** and call a **TSL** function.

Testing goes from Vite vanilla JS all the way to TS + React + React Three Fiber + Next.js (Pages and App routers).

This is the behavior expected for the upcoming Three.js r171 release.

## TLDR

- ✅ **Vite + vanilla Three.js**: Works in all cases.
- ✅ **Next.js + vanilla Three.js**: Works in all cases.
- ✅ **Vite + R3F**: Works.
- ✅ **Next.js 14 + R3F**: Works in both Pages and App routers.
- ❌ **Next.js 15 + R3F**: Does not work, except with Pages Router + React 18.
- ✅ **Next.js 15 + R3F v9**: Works with a minor workaround, in both Pages and App routers.
- ✅ **Next.js 15 + R3F v9 + RSC**: Works, but good luck with that.

✅ ⚠️ All **R3F** cases work but cause the warning ⚠️ `THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.`.

You should also expect to only be able to use a subset of [Drei](https://github.com/pmndrs/drei) and the Three.js ecosystem with WebGPU, since some libraries and composants are written in GLSL. See the [Drei Compatibility](#drei-compatibility) section for the list of compatible components.

## 4cc2eb5 (2024-11-25)

**4cc2eb5** is [this commit](https://github.com/mrdoob/three.js/commit/4cc2eb5f5cde14e844266521e8b3b1daf6767ae9).

It is the current `dev` branch as of 2024-11-25, before the release of Three.js r171.

### Vite, vanilla JS

Dev: ✅ | Prod: ✅

### Vite, React, TS, SWC

Dev: ✅ | Prod: ✅

### Vite, React, JS, SWC, R3F

Dev: ✅ ⚠️ | Prod: ✅ ⚠️

> THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 14, Pages Router, R3F, React 18

Dev: ✅ ⚠️ | Prod: ✅ ⚠️

> THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 14, App Router (use client), R3F, React 18

Dev: ✅ ⚠️ | Prod: ✅ ⚠️

> THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 15, Pages Router, vanilla Three.js, React 19 RC

Dev: ✅ | Prod: ✅

### Next.js 15, App Router (use client), vanilla Three.js, React 19 RC

Dev: ✅ | Prod: ✅

### Next.js 15, Pages Router, R3F, React 18

Next.js 15 should be used with React 19 RC, but there are incompatible dependencies with R3F. Forcing react@18.3.1 in this case. Next.js issues are expected.

Dev: ⚠️ | Prod: ⚠️

> [HMR] Invalid message: {"action":"appIsrManifest","data":{}} - TypeError: Cannot read properties of undefined (reading 'pathname')

> THREE.Renderer: .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 15, App Router (use client), R3F, React 18

Next.js 15 should be used with React 19 RC, but there are incompatible dependencies with R3F. Forcing react@18.3.1 in this case. Next.js issues are expected.

❌ `TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')`

### Next.js 15, Pages Router, R3F, React 19 RC

With `npm i --legacy-peer-deps`:

❌ `TypeError: Cannot read properties of undefined (reading 'ReactCurrentOwner')`

### Next.js 15, Pages Router, R3F v9, React 19 RC

With `npm i --legacy-peer-deps`:

`TypeError: gl.xr.addEventListener is not a function`

Can be fixed with:

```jsx
<Canvas
  gl={canvas => {
    const renderer = new WebGPURenderer({ canvas })
    renderer.xr = { addEventListener: () => {} }
    return renderer
  }}
>
```

Dev: ✅ ⚠️ | Prod: ✅ ⚠️

> ⚠️ [HMR] Invalid message: {"action":"appIsrManifest","data":{}}
> ⚠️ .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 15, App Router, R3F v9, React 19 RC

Use the same `xr` fix as above.

Dev: ✅ ⚠️ | Prod: ✅ ⚠️

> ⚠️ .render() called before the backend is initialized. Try using .renderAsync() instead.

### Next.js 15, App Router, R3F v9, React 19 RC, RSC

Dev: ✅ ⚠️ | Prod: ✅ ⚠️

> ⚠️ .render() called before the backend is initialized. Try using .renderAsync() instead.

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

## Drei Compatibility

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
