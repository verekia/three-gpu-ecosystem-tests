# Three.js WebGPU Ecosystem Integration Test Suite

This repository now tests R3F 10 Alpha ([commit 723622e](https://github.com/pmndrs/react-three-fiber/commit/723622e675a02234246aa1e4e49ace4b48e14410)) and Drei 11 Alpha only, with Next 16 and Vite, with React Compiler enabled.

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

In dev and prod builds:

> Failed to load external module @react-three/drei-55417cbbf7f59941/core: SyntaxError: The requested module 'detect-gpu' does not provide an export named 'getGPUTier'

### Suggested fix

Adding this to detect-gpu's package json fixes the build:

```json
"exports": {
  ".": {
    "import": "./dist/detect-gpu.esm.js",
    "require": "./dist/detect-gpu.umd.js"
  }
},
```

### Workarounds

Adding this to next.config.mjs fixes the issue, but this causes slower build times and startup:

```js
transpilePackages: ['@react-three/drei']
```

https://publint.dev/detect-gpu@5.0.70

If you use Bun, here is a Bun patch to add to your repo:

**patches/detect-gpu@5.0.70.patch**

```diff
diff --git a/package.json b/package.json
index 22ffa92b457c0d83c052eab3f1961110d134d1b3..4f5f9ef7a8a80d6f85e3e5b241a87091d95bbe39 100644
--- a/package.json
+++ b/package.json
@@ -7,6 +7,12 @@
   "main": "dist/detect-gpu.umd.js",
   "module": "dist/detect-gpu.esm.js",
   "types": "dist/src/index.d.ts",
+  "exports": {
+    ".": {
+      "import": "./dist/detect-gpu.esm.js",
+      "require": "./dist/detect-gpu.umd.js"
+    }
+  },
   "homepage": "https://github.com/pmndrs/detect-gpu#readme",
   "bugs": {
     "url": "https://github.com/pmndrs/detect-gpu/issues"
```

add to your `package.json`:

```json
  "patchedDependencies": {
    "detect-gpu@5.0.70": "patches/detect-gpu@5.0.70.patch"
  },
```

### HMR Warning

Getting this (maybe unrelated) warning:

```
[HMR] Invalid message: {"type":"isrManifest","data":{"/":true}}
TypeError: Cannot read properties of undefined (reading 'components')
    at handleStaticIndicator (hot-reloader-pages.ts:257:42)
    at processMessage (hot-reloader-pages.ts:279:7)
    at hot-reloader-pages.ts:100:7
    at WebSocket.handleMessage (websocket.ts:68:9)
```
