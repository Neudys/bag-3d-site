/**
 * modules/floatingDecorations.js
 *
 * Geometric pattern grids behind each 3D bag model.
 *
 * Each bag gets a unique, visually ordered pattern:
 *   classic (green)  → squares grid
 *   rouge   (red)    → triangles grid
 *   rose    (pink)   → circles grid
 *   cobalt  (blue)   → diamonds grid
 *
 * Patterns are black at ~25% opacity, tiled in a consistent grid.
 * Subtle mouse-follow parallax gives depth.
 */

import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Pattern config per model ───────────────────────────────────────────── */

const PATTERN_MAP = {
  classic:  'squares',
  rouge:    'diamonds',
  rose:     'circles',
  cobalt:   'diamonds',
}

/* ── SVG pattern builders ───────────────────────────────────────────────── */
// Each returns an SVG string for a repeating tile

function buildSquaresSVG() {
  // 6×6 grid of rounded squares
  const size = 28
  const gap = 12
  const step = size + gap
  const cols = 8, rows = 8
  const w = cols * step, h = rows * step
  let rects = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rects += `<rect x="${c * step + gap / 2}" y="${r * step + gap / 2}" width="${size}" height="${size}" rx="4" fill="black" opacity="0.10"/>`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${rects}</svg>`
}

function buildTrianglesSVG() {
  // Rows of equilateral triangles, alternating up/down
  const size = 36
  const h = size * 0.866
  const cols = 9, rows = 9
  const w = cols * size, totalH = rows * h
  let polys = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * size + (r % 2 === 0 ? 0 : size / 2)
      const y = r * h
      if ((r + c) % 2 === 0) {
        // Up triangle
        polys += `<polygon points="${x},${y + h} ${x + size / 2},${y} ${x + size},${y + h}" fill="black" opacity="0.10"/>`
      } else {
        // Down triangle
        polys += `<polygon points="${x},${y} ${x + size / 2},${y + h} ${x + size},${y}" fill="black" opacity="0.10"/>`
      }
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}">${polys}</svg>`
}

function buildCirclesSVG() {
  // Evenly spaced circles in a grid
  const radius = 12
  const gap = 16
  const step = radius * 2 + gap
  const cols = 8, rows = 8
  const w = cols * step, h = rows * step
  let circles = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      circles += `<circle cx="${c * step + step / 2}" cy="${r * step + step / 2}" r="${radius}" fill="black" opacity="0.10"/>`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${circles}</svg>`
}

function buildDiamondsSVG() {
  // Grid of rotated squares (diamonds)
  const size = 22
  const gap = 14
  const step = size + gap
  const cols = 8, rows = 8
  const w = cols * step, h = rows * step
  let diamonds = ''
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * step + step / 2
      const cy = r * step + step / 2
      const half = size / 2
      diamonds += `<polygon points="${cx},${cy - half} ${cx + half},${cy} ${cx},${cy + half} ${cx - half},${cy}" fill="black" opacity="0.10"/>`
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${diamonds}</svg>`
}

const SVG_BUILDERS = {
  squares:   buildSquaresSVG,
  triangles: buildTrianglesSVG,
  circles:   buildCirclesSVG,
  diamonds:  buildDiamondsSVG,
}

/* ── FloatingDecorations class ──────────────────────────────────────────── */

export class FloatingDecorations {
  constructor() {
    this._container = document.getElementById('floating-decorations')
    this._currentId  = null
    this._patternEl  = null
    this._scrollTrigger = null
    this._expandProgress = 0
    this._mouseX = 0
    this._mouseY = 0
    this._rafId  = null

    // Track mouse for subtle parallax
    this._onMouseMove = (e) => {
      this._mouseX = (e.clientX / window.innerWidth - 0.5) * 2   // -1 to 1
      this._mouseY = (e.clientY / window.innerHeight - 0.5) * 2  // -1 to 1
    }
    document.addEventListener('mousemove', this._onMouseMove, { passive: true })
    this._startParallaxLoop()
  }

  _startParallaxLoop() {
    let currentOpacity = 1
    const tick = () => {
      if (this._patternEl) {
        const tx = this._mouseX * 8   // max 8px shift
        const ty = this._mouseY * 8
        this._patternEl.style.transform = `translate(${tx}px, ${ty}px)`

        // Mouse proximity → subtle darkening (10% base → 15% on hover)
        // When mouse is near center, darken more
        const dist = Math.sqrt(this._mouseX * this._mouseX + this._mouseY * this._mouseY)
        const targetOpacity = dist < 0.8 ? 1.5 : 1  // 1.5x = from 10% to 15%
        currentOpacity += (targetOpacity - currentOpacity) * 0.05  // smooth lerp
        this._patternEl.style.filter = `brightness(${currentOpacity})`
      }
      this._rafId = requestAnimationFrame(tick)
    }
    this._rafId = requestAnimationFrame(tick)
  }

  /** Show pattern for a given model id */
  show(modelId) {
    if (modelId === this._currentId) return
    this._currentId = modelId

    // Fade out existing pattern
    if (this._patternEl) {
      const old = this._patternEl
      old.classList.remove('is-visible')
      setTimeout(() => old.remove(), 650)
    }

    const patternType = PATTERN_MAP[modelId]
    if (!patternType) { this._patternEl = null; return }

    const builder = SVG_BUILDERS[patternType]
    if (!builder) { this._patternEl = null; return }

    // Create SVG pattern element
    const svgString = builder()
    const encoded = 'data:image/svg+xml,' + encodeURIComponent(svgString)

    const el = document.createElement('div')
    el.className = 'pattern-grid'
    el.style.backgroundImage = `url("${encoded}")`
    el.style.backgroundRepeat = 'repeat'
    el.style.backgroundPosition = 'center center'

    this._container.appendChild(el)
    this._patternEl = el

    // Trigger reflow then show
    requestAnimationFrame(() => {
      requestAnimationFrame(() => el.classList.add('is-visible'))
    })
  }

  /** Initialize scroll-driven behavior */
  initScroll() {
    this._scrollTrigger = ScrollTrigger.create({
      trigger: '#scroll-stage',
      start:   'top bottom',
      end:     'bottom top',
      scrub:   1.5,
      onUpdate: (self) => {
        this._expandProgress = self.progress
      },
    })

    // Fade out patterns when orbit section enters
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

  /** Call on model switch */
  switchToModel(modelId) {
    this.show(modelId)
  }

  dispose() {
    if (this._scrollTrigger) this._scrollTrigger.kill()
    if (this._rafId) cancelAnimationFrame(this._rafId)
    document.removeEventListener('mousemove', this._onMouseMove)
    if (this._patternEl) this._patternEl.remove()
    this._patternEl = null
  }
}
