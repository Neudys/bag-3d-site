/**
 * modules/colorTransition.js
 * Light-theme transitions — animates CSS background and vars per bag.
 */
import { gsap } from 'gsap'

export class ColorTransition {
  constructor(scene) {
    this.scene = scene   // kept for API compat, no longer sets scene.background
    this.currentConfig = null
    this._styleEl = null
  }

  transitionTo(config, duration = 0.9) {
    this.currentConfig = config

    // 1. Animate the CSS solid background color
    const envSolid = document.getElementById('env-solid')
    if (envSolid) {
      gsap.to(envSolid, { duration, backgroundColor: config.bgColor, ease: 'power2.inOut' })
    }

    // 2. Swap CSS variables (accent, text, pill)
    this._applyCSSVars(config)
  }

  _applyCSSVars(config) {
    if (!this._styleEl) {
      this._styleEl = document.createElement('style')
      this._styleEl.id = 'theme-vars'
      document.head.appendChild(this._styleEl)
    }
    this._styleEl.textContent = `
      :root {
        --accent:       ${config.accentColor};
        --text-primary: ${config.textDark};
        --text-muted:   ${config.textMuted};
      }
      .product-pill        { background: ${config.pillBg}; }
      .model-dot.is-active { background: ${config.accentColor}; }
    `
  }
}