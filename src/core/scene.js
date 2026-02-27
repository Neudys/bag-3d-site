/**
 * core/scene.js
 * Creates and owns the THREE.Scene instance.
 */

import * as THREE from 'three'

export function createScene() {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d0804)

  // Optional subtle fog for depth
  scene.fog = new THREE.FogExp2(0x0d0804, 0.035)

  return scene
}
