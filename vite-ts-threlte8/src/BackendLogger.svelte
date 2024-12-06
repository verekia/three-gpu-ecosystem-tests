<script lang="ts">
  import { onMount } from 'svelte'
  import { useThrelte } from '@threlte/core'

  const { renderer } = useThrelte()

  onMount(() => {
    // https://github.com/verekia/three-gpu-ecosystem-tests#testing-the-backend-type
    setTimeout(() => {
      // @ts-expect-error
      console.log(renderer.backend.isWebGPUBackend ? 'WebGPU Backend' : 'WebGL Backend')
    }, 1000)
  })
</script>
