<script lang="ts">
  import { onMount } from 'svelte'
  import { useThrelte } from '@threlte/core'
  // @ts-expect-error
  import WebGPU from 'three/examples/jsm/capabilities/WebGPU'

  console.log(WebGPU.isAvailable())

  const { renderer } = useThrelte()

  onMount(() => {
    // https://github.com/verekia/three-gpu-ecosystem-tests#testing-the-backend-type
    setTimeout(() => {
      // @ts-expect-error
      console.log(renderer.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend')
    }, 1000)
  })
</script>
