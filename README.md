# Three.js WebGPU Ecosystem Integration Test Suite

This repository now tests R3F 10 Alpha Canary and Drei 11 Alpha only, with Next 16 and Vite, with React Compiler enabled.

## How to test

Go to a folder, like `next-pages`.

If you have Docker installed:

- `npm run docker` to build and run the app in production mode.

> The Docker image uses Node 25.

Otherwise, to test with your local Node.js version:

1. `npm i`
2. `npm run dev` to check how it works in development.
3. `npm run start` to check how it works in production.

## ✅ Vite

Ok in dev and prod.

## ✅ Next.js App Router

Ok in dev and prod.

## ✅ Next.js Pages Router

Ok in dev and prod.

### HMR Warning

Getting this (likely unrelated) warning:

```
[HMR] Invalid message: {"type":"isrManifest","data":{"/":true}}
TypeError: Cannot read properties of undefined (reading 'components')
    at handleStaticIndicator (hot-reloader-pages.ts:257:42)
    at processMessage (hot-reloader-pages.ts:279:7)
    at hot-reloader-pages.ts:100:7
    at WebSocket.handleMessage (websocket.ts:68:9)
```
