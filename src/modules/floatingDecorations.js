/**
 * modules/floatingDecorations.js
 *
 * Floating decoration images around the 3D bag model.
 *
 * Layout rules:
 *   2 images → diagonal composition (one upper-side, one lower-opposite)
 *   3 images → triangular composition (solo big on one side, pair spread on other)
 *
 * Model → images mapping:
 *   classic (green)  → flower (solo right big) | lemon + banana (spread left)
 *   rouge   (red)    → rocket (solo left big)  | astronaut + apple (spread right)
 *   cobalt  (blue)   → human (upper-left) | human2 (lower-right)  — diagonal
 *   rose    (pink)   → flamingo (lower-left) | star (upper-right)  — diagonal
 *
 * Positioning strategy:
 *   - Center zone (±18vw) always clear for 3D bag
 *   - Decorations pushed to screen edges for visual breathing room
 *   - Vertical offsets create dynamic, non-symmetrical compositions
 *   - 3-item layouts form a triangle wrapping around the bag
 */

import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// scale: 1 = default CSS size, 1.6 = 60% bigger, etc.
// baseX/baseY position from center of viewport
const DECORATION_MAP = {
  classic: [
    // Solo right — BIG, vertically centered
    { src: '/img/flower.png', baseX: '33vw',  baseY: '2vh',    scale: 1.5 },
    // Upper-left — pushed to corner
    { src: '/img/lemon.png',  baseX: '-35vw', baseY: '-22vh',  scale: 0.95 },
    // Lower-left — offset from lemon for triangle feel
    { src: '/img/banana.png', baseX: '-28vw', baseY: '24vh',   scale: 0.85 },
  ],
  rouge: [
    // Solo left — BIG, vertically centered
    { src: '/img/rocket.png',    baseX: '-33vw', baseY: '2vh',    scale: 1.5 },
    // Upper-right — pushed to corner
    { src: '/img/astronaut.png', baseX: '30vw',  baseY: '-20vh',  scale: 0.95 },
    // Lower-right — offset from astronaut for triangle
    { src: '/img/apple.png',     baseX: '35vw',  baseY: '22vh',   scale: 0.8 },
  ],
  cobalt: [
    // Diagonal composition: upper-left to lower-right
    { src: '/img/human.png',  baseX: '-33vw', baseY: '-10vh', scale: 1.4 },
    { src: '/img/human2.png', baseX: '33vw',  baseY: '10vh',  scale: 1.4 },
  ],
  rose: [
    // Diagonal composition: lower-left to upper-right
    { src: '/img/flamingo.png', baseX: '-33vw', baseY: '10vh',  scale: 1.4 },
    { src: '/img/star.png',     baseX: '33vw',  baseY: '-10vh', scale: 1.4 },
  ],
}

export class FloatingDecorations {
  constructor() {
    this._container = document.getElementById('floating-decorations')
    this._currentId  = null
    this._elements   = []     // current DOM <img> elements
    this._scrollTrigger = null
    this._expandProgress = 0
  }

  /** Show decorations for a given model id (e.g. 'classic') */
  show(modelId) {
    if (modelId === this._currentId) return
    this._currentId = modelId

    // Fade out existing
    this._elements.forEach(el => el.classList.remove('is-visible'))

    // Remove old after transition
    const oldEls = [...this._elements]
    setTimeout(() => oldEls.forEach(el => el.remove()), 650)

    // Create new
    const items = DECORATION_MAP[modelId]
    if (!items) { this._elements = []; return }

    this._elements = items.map((item, i) => {
      const img = document.createElement('img')
      img.className = `float-img float-img--${i}`
      img.src = item.src
      img.alt = ''
      img.draggable = false

      // Position from center of screen
      img.style.left = '50%'
      img.style.top  = '50%'
      img.style.setProperty('--fx', item.baseX)
      img.style.setProperty('--fy', item.baseY)

      // Individual scale
      if (item.scale && item.scale !== 1) {
        img.style.setProperty('--img-scale', item.scale)
      }

      // Initial translate uses CSS custom properties via animation
      img.style.transform = `translate(${item.baseX}, ${item.baseY})`

      this._container.appendChild(img)

      // Trigger reflow then show
      requestAnimationFrame(() => {
        requestAnimationFrame(() => img.classList.add('is-visible'))
      })

      return img
    })

    // Re-apply current scroll expansion
    this._applyExpansion(this._expandProgress)
  }

  /** Initialize scroll-driven expansion from hero through scroll-stage */
  initScroll() {
    // Expansion: images drift outward as user scrolls down
    // from scroll-stage start until features-orbit appears
    this._scrollTrigger = ScrollTrigger.create({
      trigger: '#scroll-stage',
      start:   'top bottom',
      end:     'bottom top',
      scrub:   1.5,
      onUpdate: (self) => {
        this._expandProgress = self.progress
        this._applyExpansion(self.progress)
      },
    })

    // Fade out decorations when orbit section enters
    ScrollTrigger.create({
      trigger: '.features-scroll-track',
      start:   'top 90%',
      end:     'top 40%',
      scrub:   true,
      onUpdate: (self) => {
        if (this._container) {
          this._container.style.opacity = String(1 - self.progress)
        }
      },
      onLeaveBack: () => {
        if (this._container) this._container.style.opacity = '1'
      },
    })
  }

  /**
   * Apply expansion based on scroll progress (0 → 1).
   * Each image drifts further to its side.
   */
  _applyExpansion(p) {
    const items = DECORATION_MAP[this._currentId]
    if (!items || !this._elements.length) return

    // Eased expansion factor — accelerates slightly
    const ease = p * p * 0.8 + p * 0.2  // gentle ease-in

    this._elements.forEach((el, i) => {
      const item = items[i]
      if (!item || !el) return

      // Parse the base position to determine direction
      const isLeft = item.baseX.startsWith('-')

      // Expand outward: add extra vw in the direction of the image
      const extraX = isLeft ? -ease * 12 : ease * 12  // up to ±12vw extra

      el.style.setProperty('--fx', `calc(${item.baseX} + ${extraX}vw)`)
      el.style.setProperty('--fy', item.baseY)
    })
  }

  /** Call on model switch */
  switchToModel(modelId) {
    this.show(modelId)
  }

  dispose() {
    if (this._scrollTrigger) this._scrollTrigger.kill()
    this._elements.forEach(el => el.remove())
    this._elements = []
  }
}