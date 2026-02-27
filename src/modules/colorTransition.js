/**
 * modules/colorTransition.js
 * Handles all color/environment transitions between models.
 * Decoupled from Three.js — operates on CSS and DOM.
 */

import { gsap } from 'gsap'
import * as THREE from 'three'

export class ColorTransition {
  constructor(scene) {
    this.scene = scene
    this.envGradient = document.getElementById('env-gradient')
    this.envNoise = document.getElementById('env-noise')
    this.currentConfig = null
  }

  /**
   * Transition to a new model's color environment.
   * @param {object} config - from modelsConfig
   * @param {number} duration
   */
  transitionTo(config, duration = 1.0) {
    this.currentConfig = config

    // Background gradient fade
    if (this.envGradient) {
      gsap.to(this.envGradient, {
        duration: duration * 0.8,
        opacity: 0,
        ease: 'power2.in',
        onComplete: () => {
          this.envGradient.style.background = config.bgGradient
          gsap.to(this.envGradient, {
            duration: duration * 0.8,
            opacity: 1,
            ease: 'power2.out'
          })
        }
      })
    }

    // Accent color on CSS variable
    this._setCSSAccent(config.accentColor, duration)

    // Scene fog color
    if (this.scene.fog) {
      const targetFogColor = new THREE.Color(this._hexToRGB(config.bgGradient))
      // Animate via tick (GSAP proxy)
      const proxy = { r: this.scene.fog.color.r, g: this.scene.fog.color.g, b: this.scene.fog.color.b }
      gsap.to(proxy, {
        duration,
        r: this.scene.background.r ?? 0.05,
        g: this.scene.background.g ?? 0.03,
        b: this.scene.background.b ?? 0.02,
        onUpdate: () => {
          this.scene.fog.color.setRGB(proxy.r, proxy.g, proxy.b)
        }
      })
    }
  }

  _setCSSAccent(hex, duration) {
    // Animate CSS variable via proxy
    const el = document.documentElement
    el.style.setProperty('--accent-target', hex)
    // Inject a tiny animation using a style tag trick
    const existing = document.getElementById('accent-anim-style')
    if (existing) existing.remove()
    const style = document.createElement('style')
    style.id = 'accent-anim-style'
    style.textContent = `
      :root { --accent: ${hex}; }
      .cta-btn { border-color: ${hex}; color: ${hex}; }
      .meta-tag { color: ${hex}; border-color: ${hex}; }
      .loader-fill { background: ${hex}; }
      .model-dot.is-active { background: ${hex}; border-color: ${hex}; }
    `
    document.head.appendChild(style)
  }

  // Extract dominant dark color from gradient string (rough heuristic)
  _hexToRGB(gradientStr) {
    return '#0d0804'
  }
}
