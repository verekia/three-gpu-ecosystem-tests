<script lang="ts">
  import { Canvas, T } from '@threlte/core'
  import { OrbitControls } from '@threlte/extras'
  import { color } from 'three/tsl'
  import { WebGPURenderer, MeshBasicNodeMaterial } from 'three/webgpu'
  import BackendLogger from '../components/BackendLogger.svelte'
</script>

<main>
  <Canvas createRenderer={canvas => new WebGPURenderer({ canvas })}>
    <T.PerspectiveCamera makeDefault position={[0, 0, 10]}>
      <OrbitControls />
    </T.PerspectiveCamera>

    <T.Mesh>
      <T.BoxGeometry />
      <T is={MeshBasicNodeMaterial} colorNode={color('#fff000')} />
    </T.Mesh>

    <BackendLogger />
  </Canvas>
</main>

<style>
  :global(html, body) {
    margin: 0;
    padding: 0;
  }

  main {
    width: 100vw;
    height: 100vh;
  }
</style>
