import { defineConfig } from 'vite'

export default defineConfig({
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/gsap')) return 'gsap'
        }
      }
    }
  }
})
