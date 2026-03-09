/**
 * modules/scrollController.js
 *
 * Drives the bag during #scroll-stage (300 vh).
 *
 * progress 0 → 1:
 *  rotation.y  2 full turns (720 °)
 *  rotation.x  1 oscillation  — tumble
 *  rotation.z  1.5 oscillations — wobble
 *  position.y  descends until bag centre is at screen-bottom edge
 *              (only top half visible at progress = 1)
 *
 * computeModelState(config, p) — shared formula used by modelManager.goTo()
 * so an incoming model starts exactly where scroll expects it → no glitch.
 */

import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Camera: FOV 42°, z 15.5 → visible half-height ≈ 5.95 units at z = 0.
const DESCENT_DESKTOP = 4.0   // baja la mitad que antes
const DESCENT_MOBILE  = 2.5

export class ScrollController {
  constructor(modelManager) {
    this.modelManager = modelManager
    this._isMobile    = window.innerWidth < 768
    this._progress    = 0
  }

  init() {
    ScrollTrigger.create({
      trigger: '#scroll-stage',
      start:   'top bottom',
      end:     'bottom top',
      scrub:   2.5,
      onUpdate: (self) => {
        this._progress = self.progress
        this._applyScrollProgress(self.progress)
      },
    })

    let barHidden = false;
    const bar = document.getElementById("product-bar");

    // Hide bar once when the marker's top reaches the viewport bottom.
    // onEnter fires only on the downward crossing — no re-triggering on further scroll.
    ScrollTrigger.create({
      trigger: ".hid-product-bar",
      start: "top bottom",
      onEnter: () => {
        if (!barHidden) {
          gsap.to(bar, { y: 120, opacity: 0, pointerEvents: "none", duration: 0.3, ease: "power2.out" });
          barHidden = true;
        }
      },
    });

    // Re-show bar only when the user scrolls all the way back to the very top.
    // A passive window scroll listener works independently of where ScrollTrigger is active.
    const _onScrollTop = () => {
      if (barHidden && window.scrollY === 0) {
        gsap.to(bar, { y: 0, opacity: 1, pointerEvents: "auto", duration: 0.3, ease: "power2.out" });
        barHidden = false;
      }
    };
    window.addEventListener("scroll", _onScrollTop, { passive: true });
  }

  /** Congela esta animación — usado por boxAnimationSection */
  disable() { this._disabled = true  }
  enable()  { this._disabled = false }

  _applyScrollProgress(p) {
    if (this._disabled) return
    const model  = this.modelManager.getCurrentModel()
    const config = this.modelManager.getCurrentConfig()
    if (!model || !config || this.modelManager.isTransitioning) return

    const s = this.computeModelState(config, p)
    model.rotation.y = s.rotY
    model.rotation.x = s.rotX
    model.rotation.z = s.rotZ
    model.position.y = s.posY
    // position.x is owned by interactionController — do not touch
  }

  computeModelState(config, p) {
    const descent = this._isMobile ? DESCENT_MOBILE : DESCENT_DESKTOP
    return {
      rotY: config.modelRotationY + p * Math.PI * 4,
      rotX: Math.sin(p * Math.PI * 2) * 0.50,
      rotZ: Math.sin(p * Math.PI * 3) * 0.22,
      posY: config.modelPosition[1] - p * descent,
    }
  }

  getProgress() { return this._progress }

  onResize() {
    this._isMobile = window.innerWidth < 768
    ScrollTrigger.refresh()
  }

  dispose() {
    ScrollTrigger.getAll().forEach(t => t.kill())
  }
}