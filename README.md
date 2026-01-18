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

## ✅ Next.js Pages Router

 Ok in dev and prod.

