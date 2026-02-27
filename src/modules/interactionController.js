/**
 * modules/interactionController.js
 * Handles mouse-move tilt (subtle X/Y lean) and cursor updates.
 * Uses interpolation so it never snaps — smooth, cinematic.
 */

import { gsap } from 'gsap'

export class InteractionController {
  constructor(modelManager) {
    this.modelManager = modelManager
    this._mouse = { x: 0, y: 0 }
    this._target = { x: 0, y: 0 }
    this._isMobile = window.innerWidth < 768

    // Max lean in radians
    this._maxLeanX = 0.10
    this._maxLeanY = 0.08

    this._onMouseMove = this._handleMouseMove.bind(this)
    this._onTouchMove  = this._handleTouchMove.bind(this)
  }

  init() {
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('touchmove', this._onTouchMove, { passive: true })
  }

  _handleMouseMove(e) {
    // Normalize to [-1, +1]
    this._target.x = (e.clientX / window.innerWidth) * 2 - 1
    this._target.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }

  _handleTouchMove(e) {
    if (!e.touches[0]) return
    this._target.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1
    this._target.y = -((e.touches[0].clientY / window.innerHeight) * 2 - 1)
  }

  /**
   * Called every frame from the render loop.
   * Lerps current mouse toward target and applies lean to model.
   */
  tick() {
    // Skip heavy effect on mobile
    if (this._isMobile) return

    const model = this.modelManager.getCurrentModel()
    const config = this.modelManager.getCurrentConfig()
    if (!model || !config) return

    // Smooth interpolation
    const lerpFactor = 0.06
    this._mouse.x += (this._target.x - this._mouse.x) * lerpFactor
    this._mouse.y += (this._target.y - this._mouse.y) * lerpFactor

    // Apply only if not mid-transition
    if (!this.modelManager.isTransitioning) {
      model.rotation.x = this._mouse.y * this._maxLeanX
      // X lean adds on top of scroll-driven Y rotation — let scroll controller own rotation.y
    }
  }

  onResize() {
    this._isMobile = window.innerWidth < 768
  }

  dispose() {
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('touchmove', this._onTouchMove)
  }
}
