/**
 * main.js — Boot & orchestration.
 *
 * SEQUENCE:
 *  1. Loader: white screen, "MODUBAG" letters bounce in over 3s
 *  2. Models preload in parallel
 *  3. Both done → blob reveal covers loader in product color
 *  4. Under cover → swap loader for app with matching bg
 *  5. Blobs slide away → product screen revealed
 *  6. Product bounces up from below
 *  7. Nav + bottom bar stagger in
 */
import './styles/base.css'
import './styles/layout.css'
import './styles/animations.css'
import './styles/responsive.css'

import './core/lenis.js'

import { createScene }                              from './core/scene.js'
import { createCamera, updateCameraForViewport }    from './core/camera.js'
import { createRenderer, handleRendererResize }     from './core/renderer.js'

import { ColorTransition }       from './modules/colorTransition.js'
import { ModelManager }          from './modules/modelManager.js'
import { AnimationController }   from './modules/animationController.js'
import { ScrollController }      from './modules/scrollController.js'
import { InteractionController } from './modules/interactionController.js'

import { modelsConfig } from './config/modelsConfig.js'

window.addEventListener('DOMContentLoaded', () => {
  bootstrap().catch(err => console.error('[main] Fatal:', err))
})

async function bootstrap() {
  // ── Core Three.js ──────────────────────────────────────────────────────
  const scene    = createScene()
  const camera   = createCamera()
  updateCameraForViewport(camera)            // apply responsive position at startup
  const renderer = createRenderer('canvas-container')

  // ── Modules ────────────────────────────────────────────────────────────
  const colorTransition     = new ColorTransition(scene)
  const modelManager        = new ModelManager(scene, colorTransition)
  const animationController = new AnimationController(modelManager)
  const scrollController    = new ScrollController(modelManager)
  const interaction         = new InteractionController(modelManager)

  // ── Model switch helper ────────────────────────────────────────────────
  function switchToModel(index) {
    modelManager.goTo(index)
    animationController.updatePillName(modelsConfig[index].name)
    animationController.setActiveDot(index)
  }

  // ── 1. Start letter animation (3 seconds) ─────────────────────────────
  animationController.startLoaderLetters()

  // ── 2. Preload all models in parallel ──────────────────────────────────
  await modelManager.preloadAll(p => animationController.setLoaderProgress(p))
  animationController.markLoadingDone()

  // ── 3. When BOTH are done → blob reveal ────────────────────────────────
  animationController.scheduleReveal(() => {
    const loader = document.getElementById('loader')
    const app    = document.getElementById('app')
    const cfg    = modelsConfig[0]

    animationController.runBlobReveal(cfg.blobColor,
      // onCovered — screen hidden by blobs
      () => {
        if (loader) { loader.style.opacity = '0'; loader.style.display = 'none' }
        if (app) app.style.opacity = '1'

        modelManager.showInitial()
        scrollController.init()
        interaction.init()

        // Set pill name (invisible — will animate in with bar)
        const pill = document.getElementById('product-pill-name')
        if (pill) pill.textContent = cfg.name
      },
      // onUncovered — blobs slid away, colored screen visible
      () => {
        // Nav enters
        animationController.enterNav()

        // Product entrance from below
        const model = modelManager.getCurrentModel()
        animationController.animateProductEntrance(model, cfg, () => {
          // Then stagger bottom bar
          animationController.enterBottomBar()
        })
      }
    )
  })

  // ── Dots ───────────────────────────────────────────────────────────────
  animationController.buildModelDots(i => switchToModel(i))

  // ── Arrow buttons ──────────────────────────────────────────────────────
  document.getElementById('btn-next')?.addEventListener('click', () =>
    switchToModel((modelManager.getCurrentIndex() + 1) % modelsConfig.length)
  )
  document.getElementById('btn-prev')?.addEventListener('click', () =>
    switchToModel((modelManager.getCurrentIndex() - 1 + modelsConfig.length) % modelsConfig.length)
  )

  // ── Keyboard ───────────────────────────────────────────────────────────
  window.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') switchToModel((modelManager.getCurrentIndex() + 1) % modelsConfig.length)
    if (e.key === 'ArrowLeft')  switchToModel((modelManager.getCurrentIndex() - 1 + modelsConfig.length) % modelsConfig.length)
  })

  // ── Resize ─────────────────────────────────────────────────────────────
  window.addEventListener('resize', () => {
    handleRendererResize(renderer, camera)
    updateCameraForViewport(camera)
    scrollController.onResize()
    interaction.onResize()
  })

  // ── Render loop ────────────────────────────────────────────────────────
  function tick() {
    requestAnimationFrame(tick)
    interaction.tick()
    renderer.render(scene, camera)
  }
  tick()

  if (import.meta.env.DEV) {
    window.__scene  = scene
    window.__models = modelManager
    window.__switch = switchToModel
  }
}