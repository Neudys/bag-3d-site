/**
 * core/camera.js
 * Creates and manages the PerspectiveCamera.
 */

import * as THREE from 'three'

export function createCamera() {
  const camera = new THREE.PerspectiveCamera(
    42,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  )

  camera.position.set(0, 0.3, 15.5)
  camera.lookAt(0, 0, 0)

  return camera
}

/**
 * Adjust camera for responsive breakpoints.
 * @param {THREE.PerspectiveCamera} camera
 */
export function updateCameraForViewport(camera) {
  const w = window.innerWidth
  camera.aspect = w / window.innerHeight
  camera.updateProjectionMatrix()

  // Move camera closer on small screens so model stays large
  if (w < 480) {
    camera.position.set(0, 0.2, 17.5)
  } else if (w < 768) {
    camera.position.set(0, 0.3, 16.5)
  } else {
    camera.position.set(0, 0.3, 15.5)
  }
}