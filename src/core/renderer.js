/**
 * core/renderer.js
 * Creates the WebGLRenderer and attaches it to the DOM.
 */

import * as THREE from 'three'

/**
 * @param {string} containerId - DOM element id
 * @returns {THREE.WebGLRenderer}
 */
export function createRenderer(containerId = 'canvas-container') {
  const container = document.getElementById(containerId)
  if (!container) throw new Error(`#${containerId} not found`)

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance'
  })

  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.2

  container.appendChild(renderer.domElement)

  return renderer
}

/**
 * Handle resize for renderer + camera.
 * @param {THREE.WebGLRenderer} renderer
 * @param {THREE.PerspectiveCamera} camera
 */
export function handleRendererResize(renderer, camera) {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
