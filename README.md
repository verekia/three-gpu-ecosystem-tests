# Three.js WebGPU Ecosystem Integration Test Suite

This repository now tests R3F 10 Alpha and Drei 11 Alpha only, with Next 16 and Vite.

## How to test

Go to a folder, like `next-pages`.

If you have Docker installed:

- `npm run docker` to build and run the app in production mode.

> The Docker image uses Node 25.

Otherwise, to test with your local Node.js version:

1. `npm i --legacy-peer-deps`
2. `npm run dev` to check how it works in development.
3. `npm run start` to check how it works in production.

## ❌ Peer-deps installation

```
➜  next-pages git:(main) ✗ npm i
npm error code ERESOLVE
npm error ERESOLVE unable to resolve dependency tree
npm error
npm error While resolving: undefined@undefined
npm error Found: @react-three/fiber@10.0.0-alpha.0
npm error node_modules/@react-three/fiber
npm error   @react-three/fiber@"10.0.0-alpha.0" from the root project
npm error
npm error Could not resolve dependency:
npm error peer @react-three/fiber@">=9.0.0" from @react-three/drei@11.0.0-alpha.1
npm error node_modules/@react-three/drei
npm error   @react-three/drei@"11.0.0-alpha.1" from the root project
```

**Used `--legacy-peer-deps` to be able to install**.


## ✅ Vite

 Ok in dev and prod.

## ✅ Next.js App Router

 Ok in dev and prod.

## ❌ Next.js Pages Router

Loading the page in dev mode or building for prod:

> [!CAUTION]
> Failed to load external module @react-three/drei-55417cbbf7f59941/core: Error [ERR_MODULE_NOT_FOUND]: Cannot find module '/Users/verekia/Local/Code/three-gpu-ecosystem-tests/next-pages/node_modules/three/examples/jsm/controls/FirstPersonControls' imported from /Users/verekia/Local/Code/three-gpu-ecosystem-tests/next-pages/node_modules/@react-three/drei/core/index.mjs

### Claude's suggestion

> In @react-three/drei/core/index.mjs: The FirstPersonControls import is missing the .js extension, while other similar imports have it.

> There are 15 imports missing .js in total:

- three/examples/jsm/controls/FirstPersonControls
- three/examples/jsm/modifiers/CurveModifier
- three/examples/jsm/geometries/TextGeometry
- three/examples/jsm/loaders/FontLoader
- three/examples/jsm/loaders/SVGLoader
- three/examples/jsm/loaders/FBXLoader
- three/examples/jsm/loaders/GLTFLoader
- three/examples/jsm/loaders/DRACOLoader
- three/examples/jsm/loaders/KTX2Loader
- three/examples/jsm/objects/GroundedSkybox
- three/examples/jsm/loaders/RGBELoader
- three/examples/jsm/loaders/EXRLoader
- three/examples/jsm/shaders/HorizontalBlurShader
- three/examples/jsm/shaders/VerticalBlurShader
- three/examples/jsm/interactive/SelectionBox