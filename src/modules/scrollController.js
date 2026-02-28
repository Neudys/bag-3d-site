/**
 * modules/scrollController.js
 * Scroll-driven smooth 360° rotation. Canvas is fixed via CSS.
 * Uses GSAP ScrollTrigger for silky scrubbing.
 */

import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export class ScrollController {
  /**
   * @param {import('./modelManager.js').ModelManager} modelManager
   */
  constructor(modelManager) {
    this.modelManager = modelManager
    this._isMobile    = window.innerWidth < 768
  }

  init() {
    let stage = document.getElementById('scroll-stage')
    if (!stage) {
      stage = document.createElement('section')
      stage.id = 'scroll-stage'
      stage.setAttribute('aria-hidden', 'true')
      document.getElementById('app')?.appendChild(stage)
    }
    stage.style.display = 'block'

    ScrollTrigger.create({
      start:   0,        // from very top of page
      end:     'max',    // to full scroll bottom
      scrub:   2.5,      // very smooth
      onUpdate: (self) => {
        this._applyScrollProgress(self.progress)
      }
    })
  }

  /**
   * Full 360° rotation so the bag returns to its starting pose.
   */
  _applyScrollProgress(progress) {
    const model  = this.modelManager.getCurrentModel()
    const config = this.modelManager.getCurrentConfig()
    if (!model || !config || this.modelManager.isTransitioning) return

    const baseRotY   = config.modelRotationY
    const fullCircle = Math.PI * 2

    model.rotation.y = baseRotY + progress * fullCircle

    // Subtle vertical float on scroll
    const amp = this._isMobile ? 0.25 : 0.45
    const vertOffset = Math.sin(progress * Math.PI) * amp
    model.position.y = config.modelPosition[1] - vertOffset
  }

  onResize() {
    this._isMobile = window.innerWidth < 768
    ScrollTrigger.refresh()
  }

  dispose() {
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
}