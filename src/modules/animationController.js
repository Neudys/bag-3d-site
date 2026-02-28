/**
 * modules/animationController.js
 *
 * Handles: 3s loader letter bounce → blob reveal → product entrance → UI stagger.
 * No character/meta-text logic — stripped clean.
 */

import { gsap } from 'gsap'
import { modelsConfig } from '../config/modelsConfig.js'

export class AnimationController {
  constructor(modelManager) {
    this.modelManager  = modelManager
    this._lettersDone  = false
    this._loadingDone  = false
    this._revealFn     = null
  }

  // ── 1. Loader letters — 3 seconds total ─────────────────────────────────

  startLoaderLetters(onAllDone) {
    const container = document.getElementById('loader-logo')
    if (!container) { onAllDone?.(); return }

    const word = 'MODUBAG'
    container.innerHTML = ''

    // Calculate per-letter delay to fill ~2.4s, last letter animation finishes at ~3s
    const letterDuration = 0.6      // each letter's bounce (seconds)
    const totalLetters   = word.length
    const perLetterDelay = 0.32     // 7 letters × 0.32s = 2.24s start of last, +0.6s = ~2.84s

    word.split('').forEach((ch, i) => {
      const span = document.createElement('span')
      span.className = 'loader-letter'
      span.textContent = ch
      span.style.animationDelay = `${i * perLetterDelay}s`
      span.style.animationDuration = `${letterDuration}s`
      container.appendChild(span)
    })

    // Letters fully done at ~3s
    const totalMs = (totalLetters - 1) * (perLetterDelay * 1000) + (letterDuration * 1000) + 100
    setTimeout(() => {
      this._lettersDone = true
      this._tryBothReady()
      onAllDone?.()
    }, totalMs)
  }

  // ── 2. Progress bar ──────────────────────────────────────────────────────

  setLoaderProgress(progress) {
    const fill = document.querySelector('.loader-fill')
    if (fill) gsap.to(fill, { duration: 0.35, width: `${progress * 100}%`, ease: 'power1.out' })
  }

  markLoadingDone() {
    this._loadingDone = true
    this._tryBothReady()
  }

  // ── 3. Gate — both letters + loading done ────────────────────────────────

  _tryBothReady() {
    if (this._lettersDone && this._loadingDone && this._revealFn) {
      const fn = this._revealFn
      this._revealFn = null
      fn()
    }
  }

  scheduleReveal(fn) {
    this._revealFn = fn
    this._tryBothReady()
  }

  // ── 4. Blob reveal (two callbacks) ───────────────────────────────────────

  runBlobReveal(blobColor, onCovered, onUncovered) {
    const layer = document.createElement('div')
    layer.id = 'blob-reveal-layer'
    Object.assign(layer.style, {
      position: 'fixed', inset: '0', zIndex: '10000',
      pointerEvents: 'none', overflow: 'hidden'
    })
    document.body.appendChild(layer)

    const diag = Math.hypot(window.innerWidth, window.innerHeight)
    const NUM  = 28

    for (let i = 0; i < NUM; i++) {
      const el = document.createElement('div')
      const x  = Math.random() * 110 - 5
      const y  = Math.random() * 110 - 5
      const sz = diag * (0.8 + Math.random() * 0.6)
      const delay = Math.random() * 0.42

      Object.assign(el.style, {
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        width: '0', height: '0',
        borderRadius: '50%',
        background: blobColor,
        transform: 'translate(-50%,-50%)'
      })
      layer.appendChild(el)
      gsap.to(el, { width: sz, height: sz, duration: 0.7, delay, ease: 'power2.in' })
    }

    // Covered at ~700ms
    setTimeout(() => { onCovered?.() }, 720)

    // Hold, then slide away
    setTimeout(() => {
      gsap.to(layer, {
        y: '-100%', duration: 0.8, ease: 'power3.inOut',
        onComplete: () => {
          layer.remove()
          onUncovered?.()
        }
      })
    }, 1400)
  }

  // ── 5. Nav entrance ──────────────────────────────────────────────────────

  enterNav() {
    gsap.from('#nav', { duration: 0.8, y: -50, opacity: 0, ease: 'power3.out' })
  }

  // ── 6. Product entrance (bounce from below) ─────────────────────────────

  animateProductEntrance(model, config, onComplete) {
    if (!model) { onComplete?.(); return }

    gsap.timeline()
      .to(model.scale, {
        x: config.modelScale, y: config.modelScale, z: config.modelScale,
        duration: 1.1, ease: 'back.out(1.9)'
      })
      .to(model.position, {
        y: config.modelPosition[1],
        duration: 1.25, ease: 'back.out(2.2)',
        onComplete
      }, '<+0.05')
  }

  // ── 7. Bottom bar stagger ────────────────────────────────────────────────

  enterBottomBar() {
    gsap.timeline()
      .from('.product-bar', { duration: 0.8, y: 60, opacity: 0, ease: 'back.out(1.6)' })
  }

  // ── Pill name update on model switch ─────────────────────────────────────

  updatePillName(name) {
    const el = document.getElementById('product-pill-name')
    if (!el) return

    gsap.timeline()
      .to(el, { duration: 0.2, opacity: 0, y: -8, ease: 'power2.in' })
      .call(() => { el.textContent = name })
      .to(el, { duration: 0.4, opacity: 1, y: 0, ease: 'power3.out' })
  }

  // ── Dots ─────────────────────────────────────────────────────────────────

  buildModelDots(onDotClick) {
    const container = document.getElementById('model-dots')
    if (!container) return
    modelsConfig.forEach((cfg, i) => {
      const dot = document.createElement('button')
      dot.className = 'model-dot' + (i === 0 ? ' is-active' : '')
      dot.setAttribute('aria-label', cfg.name)
      dot.dataset.index = i
      dot.addEventListener('click', () => onDotClick(i))
      container.appendChild(dot)
    })
  }

  setActiveDot(index) {
    document.querySelectorAll('.model-dot').forEach((d, i) => {
      d.classList.toggle('is-active', i === index)
    })
  }
}