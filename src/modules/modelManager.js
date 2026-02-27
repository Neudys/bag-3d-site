/**
 * modules/modelManager.js
 * Responsible for loading all GLB models, caching them,
 * and orchestrating the GSAP-powered model switch sequence.
 */

import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { gsap } from 'gsap'
import { modelsConfig } from '../config/modelsConfig.js'

export class ModelManager {
  /**
   * @param {THREE.Scene} scene
   * @param {ColorTransition} colorTransition
   */
  constructor(scene, colorTransition) {
    this.scene = scene
    this.colorTransition = colorTransition

    this.loader = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    this.loader.setDRACOLoader(this.dracoLoader)

    /** @type {Map<string, THREE.Group>} */
    this.cache = new Map()

    this.currentIndex = 0
    this.currentModel = null
    this.isTransitioning = false

    // Lights owned by ModelManager (swapped per model)
    this.lights = []
    this._setupLights()
  }

  // ─── Lights ───────────────────────────────────────────────────────────────

  _setupLights() {
    // Ambient
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    this.scene.add(this.ambientLight)

    // Key light
    this.keyLight = new THREE.DirectionalLight(0xffe0a0, 1.4)
    this.keyLight.position.set(3, 6, 4)
    this.keyLight.castShadow = true
    this.keyLight.shadow.mapSize.width = 1024
    this.keyLight.shadow.mapSize.height = 1024
    this.scene.add(this.keyLight)

    // Fill light
    this.fillLight = new THREE.DirectionalLight(0x8b5e20, 0.6)
    this.fillLight.position.set(-4, 2, -3)
    this.scene.add(this.fillLight)

    // Rim light
    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.4)
    this.rimLight.position.set(0, -3, -5)
    this.scene.add(this.rimLight)

    this.lights = [this.ambientLight, this.keyLight, this.fillLight, this.rimLight]
  }

  _adaptLightsToConfig(config) {
    gsap.to(this.keyLight.color, {
      duration: 0.9,
      r: new THREE.Color(config.lightColor1).r,
      g: new THREE.Color(config.lightColor1).g,
      b: new THREE.Color(config.lightColor1).b,
      ease: 'power2.inOut'
    })
    gsap.to(this.fillLight.color, {
      duration: 0.9,
      r: new THREE.Color(config.lightColor2).r,
      g: new THREE.Color(config.lightColor2).g,
      b: new THREE.Color(config.lightColor2).b,
      ease: 'power2.inOut'
    })
    gsap.to(this.ambientLight, {
      duration: 0.9,
      intensity: config.ambientIntensity,
      ease: 'power2.inOut'
    })
  }

  // ─── Loading ──────────────────────────────────────────────────────────────

  /**
   * Preload all models. Returns a promise with progress [0..1].
   * @param {function(number)} onProgress
   */
  async preloadAll(onProgress) {
    const total = modelsConfig.length
    let loaded = 0

    for (const cfg of modelsConfig) {
      if (!this.cache.has(cfg.id)) {
        await this._loadModel(cfg)
      }
      loaded++
      onProgress?.(loaded / total)
    }
  }

  _loadModel(config) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        config.path,
        (gltf) => {
          const model = gltf.scene
          model.scale.setScalar(config.modelScale)
          model.position.set(...config.modelPosition)
          model.rotation.y = config.modelRotationY

          // Enable shadows on all meshes
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              // Ensure materials render correctly
              if (child.material) {
                child.material.envMapIntensity = 0.8
              }
            }
          })

          this.cache.set(config.id, model)
          resolve(model)
        },
        undefined,
        (err) => {
          console.error(`Failed to load model ${config.id}:`, err)
          // Fallback: create a placeholder box
          const geo = new THREE.BoxGeometry(1, 1.4, 0.6)
          const mat = new THREE.MeshStandardMaterial({ color: 0x555555 })
          const mesh = new THREE.Mesh(geo, mat)
          const group = new THREE.Group()
          group.add(mesh)
          group.scale.setScalar(config.modelScale)
          group.position.set(...config.modelPosition)
          this.cache.set(config.id, group)
          resolve(group)
        }
      )
    })
  }

  // ─── Display first model ──────────────────────────────────────────────────

  showInitial() {
    const config = modelsConfig[0]
    const model = this.cache.get(config.id)
    if (!model) return

    model.visible = true
    model.rotation.y = config.modelRotationY
    this.scene.add(model)
    this.currentModel = model

    // Entrance animation: scale from 0 + float up
    model.scale.setScalar(0)
    model.position.y = config.modelPosition[1] - 1

    gsap.to(model.scale, {
      duration: 1.2,
      x: config.modelScale,
      y: config.modelScale,
      z: config.modelScale,
      ease: 'back.out(1.5)',
      delay: 0.2
    })
    gsap.to(model.position, {
      duration: 1.1,
      y: config.modelPosition[1],
      ease: 'power3.out',
      delay: 0.2
    })

    this._adaptLightsToConfig(config)
    this.colorTransition.transitionTo(config, 1.0)
  }

  // ─── Switch models ────────────────────────────────────────────────────────

  /**
   * Navigate to a specific model index.
   * @param {number} index
   */
  goTo(index) {
    if (this.isTransitioning) return
    if (index === this.currentIndex) return
    if (index < 0 || index >= modelsConfig.length) return

    this.isTransitioning = true
    const prevConfig = modelsConfig[this.currentIndex]
    const nextConfig = modelsConfig[index]
    const prevModel = this.currentModel
    const nextModel = this.cache.get(nextConfig.id)

    if (!nextModel) {
      this.isTransitioning = false
      return
    }

    const direction = index > this.currentIndex ? 1 : -1

    // 1. Animate OUT the current model
    gsap.timeline()
      .to(prevModel.rotation, {
        duration: 0.5,
        y: prevConfig.modelRotationY + direction * Math.PI * 0.6,
        ease: 'power2.in'
      })
      .to(prevModel.scale, {
        duration: 0.45,
        x: 0, y: 0, z: 0,
        ease: 'power3.in'
      }, '<+0.1')
      .call(() => {
        this.scene.remove(prevModel)
        prevModel.position.set(...prevConfig.modelPosition)
        prevModel.rotation.y = prevConfig.modelRotationY

        // 2. Prepare next model
        nextModel.scale.setScalar(0)
        nextModel.rotation.y = nextConfig.modelRotationY - direction * Math.PI * 0.5
        nextModel.position.set(...nextConfig.modelPosition)
        this.scene.add(nextModel)
        this.currentModel = nextModel
        this.currentIndex = index

        // 3. Animate IN the new model
        gsap.to(nextModel.scale, {
          duration: 0.8,
          x: nextConfig.modelScale,
          y: nextConfig.modelScale,
          z: nextConfig.modelScale,
          ease: 'back.out(1.4)'
        })
        gsap.to(nextModel.rotation, {
          duration: 0.9,
          y: nextConfig.modelRotationY,
          ease: 'power3.out'
        })

        // 4. Color + lights transition
        this._adaptLightsToConfig(nextConfig)
        this.colorTransition.transitionTo(nextConfig, 0.7)

        // Done
        setTimeout(() => { this.isTransitioning = false }, 900)
      })
  }

  next() {
    this.goTo((this.currentIndex + 1) % modelsConfig.length)
  }

  prev() {
    this.goTo((this.currentIndex - 1 + modelsConfig.length) % modelsConfig.length)
  }

  getCurrentConfig() {
    return modelsConfig[this.currentIndex]
  }

  getCurrentModel() {
    return this.currentModel
  }

  getCurrentIndex() {
    return this.currentIndex
  }

  dispose() {
    this.lights.forEach(l => this.scene.remove(l))
    this.cache.forEach(model => {
      this.scene.remove(model)
      model.traverse(child => {
        if (child.isMesh) {
          child.geometry?.dispose()
          if (Array.isArray(child.material)) {
            child.material.forEach(m => m.dispose())
          } else {
            child.material?.dispose()
          }
        }
      })
    })
    this.cache.clear()
  }
}
