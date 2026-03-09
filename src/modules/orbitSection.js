/**
 * modules/orbitSection.js
 *
 * Scroll-driven conveyor-belt orbit:
 *  Phase 0 (0 → 20%):   White dome RISES + rounds
 *  Phase 1 (20 → 100%):  Ring rotates CCW. Cards appear staggered from RIGHT,
 *                         travel counter-clockwise, tilt to follow the arc,
 *                         and fade out on the LEFT.
 *
 *  Curved text: Each letter is a <tspan> on an SVG arc.
 *               Letters reveal one-by-one left→right driven by scroll,
 *               matching the cards' conveyor-belt feel.
 *
 *  ✦ Dome curvature is now relative to viewport width:
 *       narrow → subtle arc   |   wide → dramatic dome
 *  ✦ Orbit radius adapts to aspect ratio:
 *       tall+narrow → cards pushed further from center
 */

import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Config ────────────────────────────────────────────────────────────── */
const CURVED_TEXT_DEFAULT = 'BEBIDA ENERGETICA SUPER BUENA'
const RING_TOTAL_DEG      = -600
const CARD_STAGGER        = 0.07
const ACTIVATE_START      = 0.18
const RING_ANIM_START     = 20
const RING_ANIM_DUR       = 80

/* ── Dynamic dome curvature — relative to viewport width ─────────────── *
 *  Maps vw from 320 → 1440 to a vertical border-radius %
 *  Initial (flat):  1% → 3%
 *  Final (dome):    4% → 38%
 *  Always keeps a subtle minimum arc even on the narrowest screens.
 */
const CURVE_INITIAL_MIN = 1     // vertical-radius % at 320px (start of anim)
const CURVE_INITIAL_MAX = 3     // vertical-radius % at 1440px (start of anim)
const CURVE_FINAL_MIN   = 4     // vertical-radius % at 320px (end of anim)
const CURVE_FINAL_MAX   = 38    // vertical-radius % at 1440px (end of anim)
const VW_MIN            = 320
const VW_MAX            = 1440

function lerp(a, b, t) {
  return a + (b - a) * Math.min(1, Math.max(0, t))
}

function vwFactor() {
  return (window.innerWidth - VW_MIN) / (VW_MAX - VW_MIN)
}

function getInitialRadius() {
  const curve = lerp(CURVE_INITIAL_MIN, CURVE_INITIAL_MAX, vwFactor())
  return `50% 50% 0 0 / ${curve}% ${curve}% 0 0`
}

function getFinalRadius() {
  const curve = lerp(CURVE_FINAL_MIN, CURVE_FINAL_MAX, vwFactor())
  return `50% 50% 0 0 / ${curve}% ${curve}% 0 0`
}

/* ── Dynamic orbit radius — adapts to aspect ratio ───────────────────── *
 *  Base: min(vw, vh) * 0.55
 *  Tall bonus: when the screen is portrait (aspect < 1), cards get
 *  pushed further out so they don't overlap the center content.
 *  The taller & narrower → the bigger the bonus (up to +35%).
 */
function getRadius() {
  const w = window.innerWidth
  const h = window.innerHeight
  const base = Math.min(w, h) * 0.55
  const aspect = w / h
  // portrait → bonus grows; landscape → bonus is 0
  const tallBonus = Math.max(0, (1 - aspect) * 0.55)
  return base * (1 + tallBonus)
}

/* ── Text reveal timing ──────────────────────────────────────────────── */
const TEXT_REVEAL_START    = 0.10
const TEXT_REVEAL_END      = 0.50

export function initOrbitSection() {
  const section = document.getElementById('features-orbit')
  if (!section) return

  const track = document.querySelector('.features-scroll-track')
  const ring  = section.querySelector('.orbit-ring')
  const cards = gsap.utils.toArray('.feature-card', section)
  const bg    = section.querySelector('.orbit-bg')
  const N     = cards.length
  if (!N || !track || !ring) return

  /* ── Place cards at orbit slots (invisible) ────────────────────────── */
  const layoutCards = () => {
    const r = getRadius()
    cards.forEach((card, i) => {
      const angle = (i / N) * Math.PI * 2
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x:        Math.cos(angle) * r,
        y:        Math.sin(angle) * r,
        opacity:  0,
        scale:    0.75,
        rotation: 0,
      })
    })
  }

  gsap.set(ring, { rotation: 0 })
  if (bg) gsap.set(bg, { y: '105%', borderRadius: getInitialRadius() })
  layoutCards()

  /* ── Build curved text (returns array of letter tspans) ────────────── */
  const letterEls = buildCurvedText(section)

  /* ── Helpers ────────────────────────────────────────────────────────── */
  const absDeg       = Math.abs(RING_TOTAL_DEG)
  const oneRevScroll = (360 / absDeg) * (RING_ANIM_DUR / 100)

  /* ── Master timeline ───────────────────────────────────────────────── */
  const buildTimeline = () => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   1.5,

        onUpdate: () => {
          const progress = tl.scrollTrigger.progress
          const ringRot  = parseFloat(gsap.getProperty(ring, 'rotation')) || 0

          /* ── Cards ─────────────────────────────────────────────────── */
          cards.forEach((card, i) => {
            const baseAngleDeg = (i / N) * 360
            let world    = ((baseAngleDeg + ringRot) % 360 + 360) % 360
            const worldRad = (world * Math.PI) / 180

            const rawPosOp          = Math.max(0, -Math.sin(worldRad))
            const positionalOpacity = Math.pow(rawPosOp, 0.6)

            const activateAt   = ACTIVATE_START + i * CARD_STAGGER
            const deactivateAt = Math.min(activateAt + oneRevScroll, 1)
            const fadeWindow   = 0.045

            let life = 0
            if (progress < activateAt)                      life = 0
            else if (progress < activateAt + fadeWindow)    life = (progress - activateAt) / fadeWindow
            else if (progress < deactivateAt - fadeWindow)  life = 1
            else if (progress < deactivateAt)               life = (deactivateAt - progress) / fadeWindow
            else                                            life = 0

            const opacity = positionalOpacity * life
            const scale   = 0.75 + 0.25 * opacity
            const tilt    = baseAngleDeg - 270

            gsap.set(card, { opacity, scale, rotation: tilt })
          })

          /* ── Curved text — letter-by-letter reveal ─────────────────── */
          if (letterEls && letterEls.length) {
            const totalLetters = letterEls.length
            letterEls.forEach((span, idx) => {
              const letterStart = TEXT_REVEAL_START + (idx / totalLetters) * (TEXT_REVEAL_END - TEXT_REVEAL_START)
              const letterFade  = 0.025
              let letterOp = 0

              if (progress < letterStart)                     letterOp = 0
              else if (progress < letterStart + letterFade)   letterOp = (progress - letterStart) / letterFade
              else                                            letterOp = 1

              span.style.opacity = letterOp
            })
          }
        },
      },
    })

    /* ── Phase 0: Dome ───────────────────────────────────────────────── */
    if (bg) {
      tl.to(bg, {
        y: '0%',
        borderRadius: getFinalRadius(),
        duration: 20,
        ease: 'power2.out',
      }, 0)
    }

    /* ── Phase 1: Ring CCW ───────────────────────────────────────────── */
    tl.to(ring, {
      rotation: RING_TOTAL_DEG,
      duration: RING_ANIM_DUR,
      ease:     'none',
    }, RING_ANIM_START)

    return tl
  }

  let currentTl = buildTimeline()

  /* ── Resize ────────────────────────────────────────────────────────── */
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      currentTl.scrollTrigger?.kill()
      currentTl.kill()
      gsap.set(ring, { rotation: 0 })
      if (bg) gsap.set(bg, { y: '105%', borderRadius: getInitialRadius() })
      layoutCards()
      currentTl = buildTimeline()
      ScrollTrigger.refresh()
    }, 200)
  })
}


/* ═══════════════════════════════════════════════════════════════════════════
   CURVED TEXT — each letter is a <tspan> on an SVG arc path
   ═══════════════════════════════════════════════════════════════════════════ */

function buildCurvedText(sectionEl) {
  sectionEl.querySelector('.orbit-curved-text')?.remove()

  const rawText = sectionEl.dataset.curvedText || CURVED_TEXT_DEFAULT
  if (!rawText) return []

  const ns = 'http://www.w3.org/2000/svg'

  const svg = document.createElementNS(ns, 'svg')
  svg.classList.add('orbit-curved-text')
  svg.setAttribute('viewBox', '0 0 1000 500')
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet')
  svg.setAttribute('aria-hidden', 'true')

  const defs   = document.createElementNS(ns, 'defs')
  const pathEl = document.createElementNS(ns, 'path')
  pathEl.setAttribute('id', 'orbit-text-arc')
  pathEl.setAttribute('d', 'M 50,460 A 490,400 0 0,1 950,460')
  pathEl.setAttribute('fill', 'none')
  defs.appendChild(pathEl)
  svg.appendChild(defs)

  const textEl     = document.createElementNS(ns, 'text')
  const textPathEl = document.createElementNS(ns, 'textPath')
  textPathEl.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', '#orbit-text-arc')
  textPathEl.setAttribute('href', '#orbit-text-arc')
  textPathEl.setAttribute('startOffset', '50%')
  textPathEl.setAttribute('text-anchor', 'middle')

  const letterEls = []

  for (let i = 0; i < rawText.length; i++) {
    const tspan = document.createElementNS(ns, 'tspan')
    tspan.textContent = rawText[i]
    tspan.style.opacity = '0'
    tspan.style.transition = 'none'
    textPathEl.appendChild(tspan)
    letterEls.push(tspan)
  }

  textEl.appendChild(textPathEl)
  svg.appendChild(textEl)
  sectionEl.appendChild(svg)

  return letterEls
}