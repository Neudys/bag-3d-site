/**
 * core/renderer.js
 * Alpha-transparent renderer — CSS background shows through.
 */
import * as THREE from 'three'

export function createRenderer(containerId = 'canvas-container') {
  const container = document.getElementById(containerId)
  if (!container) throw new Error(`#${containerId} not found`)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,                      // transparent canvas
    powerPreference: 'high-performance'
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(0x000000, 0) // fully transparent clear
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  container.appendChild(renderer.domElement)
  return renderer
}

export function handleRendererResize(renderer, camera) {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}