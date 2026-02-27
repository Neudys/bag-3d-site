/**
 * modules/animationController.js
 * GSAP orchestration of the loader, hero entrance, and UI reveals.
 */

import { gsap } from 'gsap'
import { modelsConfig } from '../config/modelsConfig.js'

export class AnimationController {
  constructor(modelManager) {
    this.modelManager = modelManager
  }

  /**
   * Animate the loader progress bar.
   * @param {number} progress 0..1
   */
  setLoaderProgress(progress) {
    const fill = document.querySelector('.loader-fill')
    if (fill) {
      gsap.to(fill, { duration: 0.3, width: `${progress * 100}%`, ease: 'power1.out' })
    }
  }

  /**
   * Hide loader and reveal the app with a luxury reveal sequence.
   * @param {function} onComplete
   */
  revealApp(onComplete) {
    const loader = document.getElementById('loader')
    const app = document.getElementById('app')

    gsap.timeline({ onComplete })
      // Fade out loader
      .to(loader, { duration: 0.8, opacity: 0, ease: 'power2.in' })
      .set(loader, { display: 'none' })
      // Fade in app
      .to(app, { duration: 0.4, opacity: 1, ease: 'power1.out' }, '-=0.1')
      // Staggered UI entrance
      .from('#nav', { duration: 0.7, y: -30, opacity: 0, ease: 'power3.out' }, '-=0.2')
      .from('.hero-meta', { duration: 0.9, x: -50, opacity: 0, ease: 'power3.out' }, '-=0.4')
      .from('.model-nav', { duration: 0.7, x: 30, opacity: 0, ease: 'power3.out' }, '<+0.1')
      .from('.scroll-hint', { duration: 0.7, y: 20, opacity: 0, ease: 'power2.out' }, '-=0.2')
  }

  /**
   * Animate the UI text panel when a model changes.
   * @param {object} config
   */
  animateUIToConfig(config) {
    const tl = gsap.timeline()

    // Fade out then update
    tl.to(['#meta-title', '#meta-desc', '#val-material', '#val-origin', '#meta-tag'], {
        duration: 0.3,
        opacity: 0,
        y: -8,
        stagger: 0.04,
        ease: 'power2.in'
      })
      .call(() => {
        const titleEl = document.getElementById('meta-title')
        const descEl  = document.getElementById('meta-desc')
        const matEl   = document.getElementById('val-material')
        const oriEl   = document.getElementById('val-origin')
        const tagEl   = document.getElementById('meta-tag')

        if (titleEl) titleEl.textContent = config.name
        if (descEl)  descEl.textContent = config.description
        if (matEl)   matEl.textContent = config.material
        if (oriEl)   oriEl.textContent = config.origin
        if (tagEl)   tagEl.textContent = `Collection 2025 — ${config.id.charAt(0).toUpperCase() + config.id.slice(1)}`
      })
      .to(['#meta-title', '#meta-desc', '#val-material', '#val-origin', '#meta-tag'], {
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.06,
        ease: 'power3.out'
      })
  }

  /**
   * Initialize dots UI from modelsConfig.
   * @param {function(number)} onDotClick
   */
  buildModelDots(onDotClick) {
    const container = document.getElementById('model-dots')
    if (!container) return

    modelsConfig.forEach((cfg, i) => {
      const dot = document.createElement('button')
      dot.classList.add('model-dot')
      dot.setAttribute('aria-label', cfg.name)
      dot.dataset.index = i
      if (i === 0) dot.classList.add('is-active')
      dot.addEventListener('click', () => onDotClick(i))
      container.appendChild(dot)
    })
  }

  /**
   * Update which dot is active.
   * @param {number} index
   */
  setActiveDot(index) {
    document.querySelectorAll('.model-dot').forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index)
    })
  }
}
