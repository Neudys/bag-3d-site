/**
 * modules/orbitSection.js
 *
 * Scroll-driven phases:
 *  Phase 0 (0 → 20%):  White dome RISES from below viewport + goes from flat to rounded
 *  Phase 1 (20 → 40%): Cards scale+fade from center to orbit positions (staggered)
 *  Phase 2 (40 → 100%): Ring rotates −360° CCW, cards counter-rotate to stay upright
 */

import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initOrbitSection() {
  const section = document.getElementById('features-orbit')
  if (!section) return

  const track  = document.querySelector('.features-scroll-track')
  const ring   = section.querySelector('.orbit-ring')
  const cards  = gsap.utils.toArray('.feature-card', section)
  const bg     = section.querySelector('.orbit-bg')
  const N      = cards.length
  if (!N || !track || !ring) return

  // Orbit radius: 55% of shorter viewport dimension
  const getRadius = () => Math.min(window.innerWidth, window.innerHeight) * 0.55

  // ── Initial state ─────────────────────────────────────────────────────
  gsap.set(cards, {
    xPercent: -50,
    yPercent: -50,
    x: 0,
    y: 0,
    opacity: 0,
    scale: 0.55,
    rotation: 0,
  })
  gsap.set(ring, { rotation: 0 })

  if (bg) {
    gsap.set(bg, {
      y: '105%',
      borderRadius: '6% 6% 0 0 / 2% 2% 0 0',
    })
  }

  // ── Build timeline ────────────────────────────────────────────────────
  const buildTimeline = () => {
    const r  = getRadius()
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: track,
        start:   'top top',
        end:     'bottom bottom',
        scrub:   1.5,
      },
    })

    // ── Phase 0: Dome rises from below + flat → rounded simultaneously ──
    if (bg) {
      tl.to(bg, {
        y: '0%',
        borderRadius: '50% 50% 0 0 / 38% 38% 0 0',
        duration: 20,
        ease: 'power2.out',
      }, 0)
    }

    // ── Phase 1: Cards fly out to orbit positions ───────────────────────
    cards.forEach((card, i) => {
      const angle = (i / N) * Math.PI * 2  // 0° (right), 90°, 180°, 270°
      tl.to(card, {
        x:        Math.cos(angle) * r,
        y:        Math.sin(angle) * r,
        opacity:  1,
        scale:    1,
        duration: 10,
        ease:     'back.out(1.5)',
      }, 15 + i * 2)
    })

    // ── Phase 2: Orbit rotates CCW, cards counter-rotate ────────────────
    tl.to(ring, {
      rotation: -360,
      duration: 60,
      ease:     'none',
    }, 30)

    tl.to(cards, {
      rotation: 360,
      duration: 60,
      ease:     'none',
    }, 30)

    return tl
  }

  let currentTl = buildTimeline()

  // ── Rebuild on resize ─────────────────────────────────────────────────
  let resizeTimer
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      currentTl.scrollTrigger?.kill()
      currentTl.kill()
      gsap.set(cards, {
        xPercent: -50, yPercent: -50,
        x: 0, y: 0, opacity: 0, scale: 0.55, rotation: 0,
      })
      gsap.set(ring, { rotation: 0 })
      if (bg) gsap.set(bg, { y: '105%', borderRadius: '6% 6% 0 0 / 2% 2% 0 0' })
      currentTl = buildTimeline()
      ScrollTrigger.refresh()
    }, 200)
  })
}