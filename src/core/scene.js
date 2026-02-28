/**
 * core/scene.js
 * Transparent scene — background handled by CSS.
 */
import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  // No background color — CSS drives it via alpha renderer
  // No fog — doesn't play well with transparent alpha canvas
  return scene
}