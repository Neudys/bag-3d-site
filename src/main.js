/**
 * main.js
 * Entry point. Boots all modules and wires them together.
 * No business logic lives here — just composition.
 */

import './styles/base.css'
import './styles/layout.css'
import './styles/animations.css'
import './styles/responsive.css'

import { createScene }               from './core/scene.js'
import { createCamera, updateCameraForViewport } from './core/camera.js'
import { createRenderer, handleRendererResize }  from './core/renderer.js'

import { ColorTransition }       from './modules/colorTransition.js'
import { ModelManager }          from './modules/modelManager.js'
import { AnimationController }   from './modules/animationController.js'
import { ScrollController }      from './modules/scrollController.js'
import { InteractionController } from './modules/interactionController.js'

import { modelsConfig } from './config/modelsConfig.js'

// ── Bootstrap ──────────────────────────────────────────────────────────────

window.addEventListener('DOMContentLoaded', () => {
  bootstrap().catch(err => console.error('[main] Fatal init error:', err))
})

async function bootstrap() {
  // Core Three.js
  const scene    = createScene()
  const camera   = createCamera()
  const renderer = createRenderer('canvas-container')

  // Modules
  const colorTransition     = new ColorTransition(scene)
  const modelManager        = new ModelManager(scene, colorTransition)
  const animationController = new AnimationController(modelManager)
  const scrollController    = new ScrollController(modelManager)
  const interaction         = new InteractionController(modelManager)

  // Model switch helper (closure — all modules in scope)
  function switchToModel(index) {
    modelManager.goTo(index)
    animationController.animateUIToConfig(modelsConfig[index])
    animationController.setActiveDot(index)
  }

  // Preload all models with loader progress
  await modelManager.preloadAll((progress) => {
    animationController.setLoaderProgress(progress)
  })

  // Show first model then reveal app
  modelManager.showInitial()

  animationController.revealApp(() => {
    scrollController.init()
    interaction.init()
    animationController.animateUIToConfig(modelsConfig[0])
  })

  // Build model dots
  animationController.buildModelDots((index) => switchToModel(index))

  // Button bindings
  document.getElementById('btn-next')?.addEventListener('click', () => {
    switchToModel((modelManager.getCurrentIndex() + 1) % modelsConfig.length)
  })
  document.getElementById('btn-prev')?.addEventListener('click', () => {
    switchToModel((modelManager.getCurrentIndex() - 1 + modelsConfig.length) % modelsConfig.length)
  })

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') switchToModel((modelManager.getCurrentIndex() + 1) % modelsConfig.length)
    if (e.key === 'ArrowLeft')  switchToModel((modelManager.getCurrentIndex() - 1 + modelsConfig.length) % modelsConfig.length)
  })

  // Resize handler
  window.addEventListener('resize', () => {
    handleRendererResize(renderer, camera)
    updateCameraForViewport(camera)
    scrollController.onResize()
    interaction.onResize()
  })

  // Render loop
  function tick() {
    requestAnimationFrame(tick)
    const now = performance.now()

    // Gentle idle float
    const model = modelManager.getCurrentModel()
    if (model && !modelManager.isTransitioning) {
      model.position.y += Math.sin(now * 0.0007) * 0.00025
    }

    interaction.tick()
    renderer.render(scene, camera)
  }

  tick()

  // DevTools
  if (import.meta.env.DEV) {
    window.__scene    = scene
    window.__models   = modelManager
    window.__renderer = renderer
    window.__switch   = switchToModel
  }
}
