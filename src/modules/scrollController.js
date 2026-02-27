/**
 * modules/scrollController.js
 * Binds ScrollTrigger to the 3D model for scroll-driven rotation and Y descent.
 * Fully reversible — scroll up returns to initial state.
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class ScrollController {
  constructor(modelManager) {
    this.modelManager = modelManager
    this.trigger = null

    // State for scroll-driven animation
    this.scrollState = { rotY: 0, posY: 0 }
    this._isMobile = window.innerWidth < 768
  }

  init() {
    // Create a tall scroll stage so user scrolls through 3D space
    ScrollTrigger.create({
      trigger: '#scroll-stage',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        this._applyScrollProgress(self.progress)
      }
    })
  }

  /**
   * Apply scroll progress [0..1] to the current model.
   */
  _applyScrollProgress(progress) {
    const model = this.modelManager.getCurrentModel()
    const config = this.modelManager.getCurrentConfig()
    if (!model || !config) return

    // Reduce animation intensity on mobile
    const rotationRange = this._isMobile ? Math.PI * 0.6 : Math.PI * 1.2
    const descentRange  = this._isMobile ? 0.6 : 1.2

    const targetRotY = config.modelRotationY + progress * rotationRange
    const targetPosY = config.modelPosition[1] - progress * descentRange

    // Lerp smoothly (handled by scrub in ScrollTrigger)
    model.rotation.y = targetRotY
    model.position.y = targetPosY
  }

  /**
   * Call on resize to adapt intensity.
   */
  onResize() {
    this._isMobile = window.innerWidth < 768
    ScrollTrigger.refresh()
  }

  dispose() {
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
}
