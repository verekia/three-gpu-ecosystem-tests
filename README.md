# Three.js WebGPU Ecosystem Integration Test Suite

This repository now tests R3F 10 Alpha and Drei 11 Alpha only, with Next 16 and Vite.

## How to test

Go to a folder, like `next-pages`.

If you have Docker installed:

- `npm run docker` to build and run the app in production mode.

> The Docker image uses Node 20, before `navigator` was added in Node 21.

Otherwise, to test with your local Node.js version:

1. `npm i`
2. `npm run dev` to check how it works in development.
3. `npm run start` to check how it works in production.

## Problems

Peer-deps installation:

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

Next.js dev or build:

```
Code generation for chunk item errored
./node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs

Code generation for chunk item errored
An error occurred while generating the chunk item [project]/node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs [client] (ecmascript)

Caused by:
- the chunking context (unknown) does not support external modules (request: node:module)

Debug info:
- An error occurred while generating the chunk item [project]/node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs [client] (ecmascript)
- Execution of <ModuleChunkItem as EcmascriptChunkItem>::content_with_async_module_info failed
- Execution of *EcmascriptChunkItemContent::new failed
- Execution of EcmascriptModuleContent::new failed
- the chunking context (unknown) does not support external modules (request: node:module)

Import trace:
  Browser:
    ./node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs
    ./node_modules/@react-three/drei/index.mjs
    ./pages/index.js
```

Vite in dev:

```
Module "node:module" has been externalized for browser compatibility. Cannot access "node:module.createRequire" in client code. See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.
get @ @react-three_drei.js?v=e0c6e482:254
(anonymous) @ @react-three_drei.js?v=e0c6e482:303
@react-three_drei.js?v=e0c6e482:303 Uncaught TypeError: (0 , import_node_module.createRequire) is not a function
    at @react-three_drei.js?v=e0c6e482:303:54
```

Vite build:

```
> tsc -b && vite build && vite preview --host

vite v5.4.10 building for production...
[plugin:vite:resolve] [plugin vite:resolve] Module "node:module" has been externalized for browser compatibility, imported by "/Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs". See https://vite.dev/guide/troubleshooting.html#module-externalized-for-browser-compatibility for more details.
✓ 472 modules transformed.
x Build failed in 1.37s
error during build:
node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs (1:9): "createRequire" is not exported by "__vite-browser-external", imported by "node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs".
file: /Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/@react-three/drei/_chunks/rolldown-runtime.mjs:1:9

1: import { createRequire } from "node:module";
            ^
2:
3: //#region rolldown:runtime

    at getRollupError (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/parseAst.js:396:41)
    at error (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/parseAst.js:392:42)
    at Module.error (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:15593:16)
    at Module.traceVariable (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:16042:29)
    at ModuleScope.findVariable (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:13825:39)
    at Identifier.bind (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:5071:40)
    at CallExpression.bind (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:2658:23)
    at CallExpression.bind (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:11289:15)
    at VariableDeclarator.bind (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:2658:23)
    at VariableDeclaration.bind (file:///Users/verekia/Local/Code/three-gpu-ecosystem-tests/vite/node_modules/rollup/dist/es/shared/node-entry.js:2654:28)
```
