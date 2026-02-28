/**
 * modules/modelManager.js
 * Loads/caches GLBs with DRACO. showInitial places model off-screen;
 * AnimationController handles the actual entrance animation.
 */
import * as THREE from 'three'
import { GLTFLoader }  from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { gsap }        from 'gsap'
import { modelsConfig } from '../config/modelsConfig.js'

export class ModelManager {
  constructor(scene, colorTransition) {
    this.scene           = scene
    this.colorTransition = colorTransition

    this.loader      = new GLTFLoader()
    this.dracoLoader = new DRACOLoader()
    this.dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
    this.loader.setDRACOLoader(this.dracoLoader)

    this.cache          = new Map()
    this.currentIndex   = 0
    this.currentModel   = null
    this.isTransitioning = false

    this._setupLights()
  }

  // ── Lights ────────────────────────────────────────────────────────────────

  _setupLights() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.9)
    this.scene.add(this.ambientLight)

    this.keyLight = new THREE.DirectionalLight(0xfff8e0, 1.2)
    this.keyLight.position.set(3, 6, 5)
    this.keyLight.castShadow = true
    this.keyLight.shadow.mapSize.width  = 1024
    this.keyLight.shadow.mapSize.height = 1024
    this.scene.add(this.keyLight)

    this.fillLight = new THREE.DirectionalLight(0xa0d090, 0.5)
    this.fillLight.position.set(-4, 2, -3)
    this.scene.add(this.fillLight)

    this.rimLight = new THREE.DirectionalLight(0xffffff, 0.35)
    this.rimLight.position.set(0, -2, -4)
    this.scene.add(this.rimLight)

    this.lights = [this.ambientLight, this.keyLight, this.fillLight, this.rimLight]
  }

  _adaptLightsToConfig(config) {
    const tween = (target, col) => gsap.to(target, {
      duration: 0.9,
      r: new THREE.Color(col).r,
      g: new THREE.Color(col).g,
      b: new THREE.Color(col).b,
      ease: 'power2.inOut'
    })
    tween(this.keyLight.color,  config.lightColor1)
    tween(this.fillLight.color, config.lightColor2)
    gsap.to(this.ambientLight, { duration: 0.9, intensity: config.ambientIntensity, ease: 'power2.inOut' })
  }

  // ── Loading ────────────────────────────────────────────────────────────────

  async preloadAll(onProgress) {
    const total = modelsConfig.length
    let loaded  = 0
    for (const cfg of modelsConfig) {
      if (!this.cache.has(cfg.id)) await this._loadModel(cfg)
      loaded++
      onProgress?.(loaded / total)
    }
  }

  _loadModel(config) {
    return new Promise((resolve) => {
      this.loader.load(
        config.path,
        (gltf) => {
          const model = gltf.scene
          model.scale.setScalar(config.modelScale)
          model.position.set(...config.modelPosition)
          model.rotation.y = config.modelRotationY
          model.traverse((child) => {
            if (child.isMesh) {
              child.castShadow = true
              child.receiveShadow = true
              if (child.material) child.material.envMapIntensity = 0.6
            }
          })
          this.cache.set(config.id, model)
          resolve(model)
        },
        undefined,
        (err) => {
          console.warn(`[ModelManager] Fallback box for ${config.id}`, err)
          const mesh  = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.4, 0.6),
            new THREE.MeshStandardMaterial({ color: 0x888888 })
          )
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

  // ── Show first model (no animation — AnimationController handles that) ────

  showInitial() {
    const config = modelsConfig[0]
    const model  = this.cache.get(config.id)
    if (!model) return

    model.rotation.y = config.modelRotationY
    model.scale.setScalar(0)                                      // starts invisible
    model.position.set(
      config.modelPosition[0],
      config.modelPosition[1] - 4.5,                             // off-screen below
      config.modelPosition[2]
    )
    this.scene.add(model)
    this.currentModel = model

    this._adaptLightsToConfig(config)
    this.colorTransition.transitionTo(config, 0.5)
  }

  // ── Switch models ──────────────────────────────────────────────────────────

  goTo(index) {
    if (this.isTransitioning)  return
    if (index === this.currentIndex) return
    if (index < 0 || index >= modelsConfig.length) return

    this.isTransitioning = true
    const prevCfg   = modelsConfig[this.currentIndex]
    const nextCfg   = modelsConfig[index]
    const prevModel = this.currentModel
    const nextModel = this.cache.get(nextCfg.id)
    if (!nextModel) { this.isTransitioning = false; return }

    const dir = index > this.currentIndex ? 1 : -1

    gsap.timeline()
      .to(prevModel.rotation, { duration: 0.5, y: prevCfg.modelRotationY + dir * Math.PI * 0.6, ease: 'power2.in' })
      .to(prevModel.scale,    { duration: 0.45, x: 0, y: 0, z: 0, ease: 'power3.in' }, '<+0.1')
      .call(() => {
        this.scene.remove(prevModel)
        prevModel.position.set(...prevCfg.modelPosition)
        prevModel.rotation.y = prevCfg.modelRotationY

        nextModel.scale.setScalar(0)
        nextModel.rotation.y = nextCfg.modelRotationY - dir * Math.PI * 0.5
        nextModel.position.set(...nextCfg.modelPosition)
        this.scene.add(nextModel)
        this.currentModel = nextModel
        this.currentIndex = index

        gsap.to(nextModel.scale,    { duration: 0.8, x: nextCfg.modelScale, y: nextCfg.modelScale, z: nextCfg.modelScale, ease: 'back.out(1.4)' })
        gsap.to(nextModel.rotation, { duration: 0.9, y: nextCfg.modelRotationY, ease: 'power3.out' })

        this._adaptLightsToConfig(nextCfg)
        this.colorTransition.transitionTo(nextCfg, 0.7)

        setTimeout(() => { this.isTransitioning = false }, 900)
      })
  }

  getCurrentConfig() { return modelsConfig[this.currentIndex] }
  getCurrentModel()  { return this.currentModel }
  getCurrentIndex()  { return this.currentIndex }
}