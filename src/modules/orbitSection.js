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

/* ── Dome border-radius — different values for mobile vs desktop ─────── */
const BG_RADIUS_INITIAL = {
  desktop: '6% 6% 0 0 / 2% 2% 0 0',
  mobile:  '6% 6% 0 0 / 4% 4% 0 0',
}
const BG_RADIUS_FINAL = {
  desktop: '50% 50% 0 0 / 38% 38% 0 0',
  mobile:  '50% 50% 0 0 / 18% 18% 0 0',
}
const isMobile = () => window.innerWidth < 768

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

  const getRadius = () => Math.min(window.innerWidth, window.innerHeight) * 0.55

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
  if (bg) gsap.set(bg, { y: '105%', borderRadius: isMobile() ? BG_RADIUS_INITIAL.mobile : BG_RADIUS_INITIAL.desktop })
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
        borderRadius: isMobile() ? BG_RADIUS_FINAL.mobile : BG_RADIUS_FINAL.desktop,
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
      if (bg) gsap.set(bg, { y: '105%', borderRadius: isMobile() ? BG_RADIUS_INITIAL.mobile : BG_RADIUS_INITIAL.desktop })
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