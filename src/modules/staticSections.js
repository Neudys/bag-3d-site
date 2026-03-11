/**
 * modules/staticSections.js
 *
 * Zipper transition + GSAP ScrollTrigger animations for all static sections
 * (eco-values, gallery, product cards, contact form).
 *
 * Professional GSAP animations with ScrollTrigger:
 *  - Eco section: cards fade + rise with stagger
 *  - Gallery: images scale from 1.05 → 1 with fade, differentiated timing
 *  - Product cards: staggered left→right appearance
 *  - Contact form: sequential input reveal + elastic button
 *  - Hover effects on product cards via GSAP
 */

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function initStaticSections() {
  initZipper()
  initGSAPAnimations()
}

/* ── GSAP ScrollTrigger Animations ──────────────────────────────────────── */

function initGSAPAnimations() {
  // Small delay to ensure DOM is ready and Lenis is initialized
  requestAnimationFrame(() => {
    animateEcoSection()
    animateGallerySection()
    animateProductCards()
    animateContactForm()
    initProductCardHovers()
  })
}

/* ── Eco Section ────────────────────────────────────────────────────────── */

function animateEcoSection() {
  const section = document.querySelector('.eco-section')
  if (!section) return

  // Header
  const header = section.querySelector('.static-section-header')
  if (header) {
    gsap.set(header, { opacity: 0, y: 40 })
    gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Cards
  const cards = section.querySelectorAll('.eco-card')
  if (cards.length) {
    gsap.set(cards, { opacity: 0, y: 50 })
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: section.querySelector('.eco-grid'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }
}

/* ── Gallery Section ────────────────────────────────────────────────────── */

function animateGallerySection() {
  const section = document.querySelector('.gallery-section')
  if (!section) return

  const mainImg = section.querySelector('.gallery-grid__main')
  const sideImgs = section.querySelectorAll('.gallery-grid__side img')

  // Main image: scale + fade with cinematic feel
  if (mainImg) {
    gsap.set(mainImg, { opacity: 0, scale: 1.05 })
    gsap.to(mainImg, {
      opacity: 1,
      scale: 1,
      duration: 1.4,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Side images: staggered scale + fade, slightly delayed
  if (sideImgs.length) {
    gsap.set(sideImgs, { opacity: 0, scale: 1.05 })
    gsap.to(sideImgs, {
      opacity: 1,
      scale: 1,
      duration: 1.2,
      ease: 'expo.out',
      stagger: 0.2,
      delay: 0.25,
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })
  }
}

/* ── Product Cards ──────────────────────────────────────────────────────── */

function animateProductCards() {
  const section = document.querySelector('.products-section')
  if (!section) return

  // Header
  const header = section.querySelector('.static-section-header')
  if (header) {
    gsap.set(header, { opacity: 0, y: 40 })
    gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Cards: staggered left-to-right with fade + rise
  const cards = section.querySelectorAll('.product-card-v2')
  if (cards.length) {
    gsap.set(cards, { opacity: 0, y: 60, scale: 0.95 })
    gsap.to(cards, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'back.out(1.2)',
      stagger: 0.18,
      scrollTrigger: {
        trigger: section.querySelector('.products-grid'),
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
  }
}

/* ── Product Card Hover Effects ─────────────────────────────────────────── */

function initProductCardHovers() {
  const cards = document.querySelectorAll('.product-card-v2')

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      gsap.to(card, {
        scale: 1.03,
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)',
        duration: 0.4,
        ease: 'power2.out',
      })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        scale: 1,
        boxShadow: '0 0px 0px rgba(0, 0, 0, 0)',
        duration: 0.35,
        ease: 'power2.inOut',
      })
    })
  })
}

/* ── Contact Form ───────────────────────────────────────────────────────── */

function animateContactForm() {
  const section = document.querySelector('.contact-section')
  if (!section) return

  const formBlock = section.querySelector('.contact-form-block')
  if (!formBlock) return

  // Form block entrance
  gsap.set(formBlock, { opacity: 0, y: 50 })
  gsap.to(formBlock, {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 75%',
      toggleActions: 'play none none none',
    },
  })

  // Title
  const title = formBlock.querySelector('.contact-form-block__title')
  if (title) {
    gsap.set(title, { opacity: 0, y: 20 })
    gsap.to(title, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Inputs: sequential stagger top → bottom
  const inputs = formBlock.querySelectorAll('.form-field, .form-row')
  if (inputs.length) {
    gsap.set(inputs, { opacity: 0, y: 25 })
    gsap.to(inputs, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power2.out',
      stagger: 0.1,
      delay: 0.35,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Divider
  const divider = formBlock.querySelector('.form-divider')
  if (divider) {
    gsap.set(divider, { scaleX: 0, transformOrigin: 'left center' })
    gsap.to(divider, {
      scaleX: 1,
      duration: 0.8,
      ease: 'power2.inOut',
      delay: 0.7,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })
  }

  // Submit button: elastic bounce entrance
  const submitBtn = formBlock.querySelector('.btn-submit')
  if (submitBtn) {
    gsap.set(submitBtn, { opacity: 0, y: 30, scale: 0.9 })
    gsap.to(submitBtn, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1,
      ease: 'elastic.out(1, 0.5)',
      delay: 0.85,
      scrollTrigger: {
        trigger: section,
        start: 'top 70%',
        toggleActions: 'play none none none',
      },
    })
  }
}


/* ── Zipper ──────────────────────────────────────────────────────────────── */

const ZIPPER_MAX_OPEN   = 0.38   // fraction of viewport height at left edge
const ZIPPER_RETRACT_AT = 0.75   // progress at which lens is fully open → flaps retract
const ZIPPER_TOOTH_GAP  = 20     // px between tooth centres along the curve
const ZIPPER_TOOTH_H    = 9      // tooth height (pointing inward)
const ZIPPER_TOOTH_W    = 6      // tooth base width
const NS = 'http://www.w3.org/2000/svg'

function initZipper() {
  const track  = document.querySelector('.zipper-track')
  const svg    = document.querySelector('.zipper-svg')
  const slider = document.querySelector('.zipper-slider')
  if (!track || !svg) return

  const flapTop    = svg.querySelector('.zipper-flap--top')
  const flapBot    = svg.querySelector('.zipper-flap--bottom')
  const teethTopG  = svg.querySelector('.zipper-teeth--top')
  const teethBotG  = svg.querySelector('.zipper-teeth--bottom')
  const seamEl     = svg.querySelector('.zipper-seam')
  const seamTintEl = svg.querySelector('.zipper-seam-tint')

  let W = 0, H = 0, CY = 0

  function resize() {
    W  = window.innerWidth
    H  = window.innerHeight
    CY = H / 2
  }

  // ── Bézier helpers ───────────────────────────────────────────────────────

  function bezPt(p0, p1, p2, p3, t) {
    const u = 1 - t
    return {
      x: u*u*u*p0.x + 3*u*u*t*p1.x + 3*u*t*t*p2.x + t*t*t*p3.x,
      y: u*u*u*p0.y + 3*u*u*t*p1.y + 3*u*t*t*p2.y + t*t*t*p3.y,
    }
  }

  function bezTan(p0, p1, p2, p3, t) {
    const u = 1 - t
    return {
      x: 3*(u*u*(p1.x-p0.x) + 2*u*t*(p2.x-p1.x) + t*t*(p3.x-p2.x)),
      y: 3*(u*u*(p1.y-p0.y) + 2*u*t*(p2.y-p1.y) + t*t*(p3.y-p2.y)),
    }
  }

  function buildLUT(p0, p1, p2, p3, N = 80) {
    const lut = [{ t: 0, len: 0 }]
    let prev = bezPt(p0, p1, p2, p3, 0), acc = 0
    for (let i = 1; i <= N; i++) {
      const t    = i / N
      const curr = bezPt(p0, p1, p2, p3, t)
      acc += Math.hypot(curr.x - prev.x, curr.y - prev.y)
      lut.push({ t, len: acc })
      prev = curr
    }
    return lut
  }

  // ── Teeth ────────────────────────────────────────────────────────────────

  function drawTeeth(group, p0, p1, p2, p3, isTop) {
    group.innerHTML = ''

    const lut      = buildLUT(p0, p1, p2, p3)
    const totalLen = lut[lut.length - 1].len
    if (totalLen < ZIPPER_TOOTH_GAP) return

    let nextLen = ZIPPER_TOOTH_GAP / 2
    let si      = 0

    while (nextLen < totalLen - ZIPPER_TOOTH_GAP / 2) {
      while (si < lut.length - 2 && lut[si + 1].len < nextLen) si++

      const a = lut[si], b = lut[si + 1]
      const frac = b.len > a.len ? (nextLen - a.len) / (b.len - a.len) : 0
      const t  = a.t + (b.t - a.t) * frac

      const pt  = bezPt(p0, p1, p2, p3, t)
      const tan = bezTan(p0, p1, p2, p3, t)
      const tl  = Math.hypot(tan.x, tan.y) || 1
      const tx  = tan.x / tl
      const ty  = tan.y / tl

      const nx = isTop ?  ty : -ty
      const ny = isTop ? -tx :  tx

      const tipX = pt.x + nx * ZIPPER_TOOTH_H
      const tipY = pt.y + ny * ZIPPER_TOOTH_H
      const b1x  = pt.x - tx * ZIPPER_TOOTH_W / 2
      const b1y  = pt.y - ty * ZIPPER_TOOTH_W / 2
      const b2x  = pt.x + tx * ZIPPER_TOOTH_W / 2
      const b2y  = pt.y + ty * ZIPPER_TOOTH_W / 2

      const poly = document.createElementNS(NS, 'polygon')
      poly.setAttribute('points',
        `${tipX.toFixed(1)},${tipY.toFixed(1)} ` +
        `${b1x.toFixed(1)},${b1y.toFixed(1)} ` +
        `${b2x.toFixed(1)},${b2y.toFixed(1)}`)
      poly.setAttribute('fill', '#a07840')
      poly.setAttribute('opacity', '0.85')
      group.appendChild(poly)

      nextLen += ZIPPER_TOOTH_GAP
    }
  }

  // ── Main update ───────────────────────────────────────────────────────────

  let rafPending = false

  function update() {
    const rect       = track.getBoundingClientRect()
    const scrollable = track.offsetHeight - window.innerHeight
    const scrolled   = Math.max(0, -rect.top)
    const progress   = scrollable > 0 ? Math.min(1, scrolled / scrollable) : 0

    const lensP   = Math.min(1, progress / ZIPPER_RETRACT_AT)
    const sliderX = W * lensP

    const eased   = 1 - Math.pow(1 - lensP, 2)
    const maxOpen = H * ZIPPER_MAX_OPEN * eased

    const tp0 = { x: sliderX,           y: CY }
    const tp1 = { x: sliderX * 0.65,    y: CY - maxOpen * 0.05 }
    const tp2 = { x: sliderX * 0.20,    y: CY - maxOpen * 0.85 }
    const tp3 = { x: 0,                 y: CY - maxOpen }

    const bp0 = { x: sliderX,           y: CY }
    const bp1 = { x: sliderX * 0.65,    y: CY + maxOpen * 0.05 }
    const bp2 = { x: sliderX * 0.20,    y: CY + maxOpen * 0.85 }
    const bp3 = { x: 0,                 y: CY + maxOpen }

    const topD = [
      `M 0 0`,
      `L ${W} 0`,
      `L ${W} ${CY}`,
      `L ${sliderX.toFixed(1)} ${CY}`,
      `C ${tp1.x.toFixed(1)} ${tp1.y.toFixed(1)}`,
      `  ${tp2.x.toFixed(1)} ${tp2.y.toFixed(1)}`,
      `  ${tp3.x.toFixed(1)} ${tp3.y.toFixed(1)}`,
      `L 0 0 Z`,
    ].join(' ')
    flapTop.setAttribute('d', topD)

    const botD = [
      `M 0 ${H}`,
      `L ${W} ${H}`,
      `L ${W} ${CY}`,
      `L ${sliderX.toFixed(1)} ${CY}`,
      `C ${bp1.x.toFixed(1)} ${bp1.y.toFixed(1)}`,
      `  ${bp2.x.toFixed(1)} ${bp2.y.toFixed(1)}`,
      `  ${bp3.x.toFixed(1)} ${bp3.y.toFixed(1)}`,
      `L 0 ${H} Z`,
    ].join(' ')
    flapBot.setAttribute('d', botD)

    const sx = sliderX.toFixed(1)
    if (seamEl) {
      seamEl.setAttribute('x1', sx)
      seamEl.setAttribute('y1', CY)
      seamEl.setAttribute('x2', W)
      seamEl.setAttribute('y2', CY)
    }
    if (seamTintEl) {
      seamTintEl.setAttribute('x1', sx)
      seamTintEl.setAttribute('y1', CY)
      seamTintEl.setAttribute('x2', W)
      seamTintEl.setAttribute('y2', CY)
    }

    if (lensP > 0.03 && maxOpen > 4) {
      drawTeeth(teethTopG, tp0, tp1, tp2, tp3, true)
      drawTeeth(teethBotG, bp0, bp1, bp2, bp3, false)
    } else {
      teethTopG.innerHTML = ''
      teethBotG.innerHTML = ''
    }

    if (slider) {
      slider.style.transform =
        `translate(${(sliderX - 28).toFixed(1)}px, ${(CY - 19).toFixed(1)}px)`
    }

    const retractRaw  = Math.max(0, (progress - ZIPPER_RETRACT_AT) / (1 - ZIPPER_RETRACT_AT))
    const retractEase = retractRaw * retractRaw

    if (retractEase > 0) {
      flapTop.style.transform = `translateY(${(-CY * retractEase).toFixed(1)}px)`
      flapBot.style.transform = `translateY(${((H - CY) * retractEase).toFixed(1)}px)`
      const fadeStr = (1 - retractRaw).toFixed(3)
      if (seamEl)     seamEl.style.opacity     = fadeStr
      if (seamTintEl) seamTintEl.style.opacity = fadeStr
      if (slider)     slider.style.opacity     = fadeStr
      teethTopG.innerHTML = ''
      teethBotG.innerHTML = ''
    } else {
      flapTop.style.transform = ''
      flapBot.style.transform = ''
      if (seamEl)     seamEl.style.opacity     = ''
      if (seamTintEl) seamTintEl.style.opacity = ''
      if (slider)     slider.style.opacity     = ''
    }

    rafPending = false
  }

  resize()
  window.addEventListener('resize', () => { resize(); update() })
  window.addEventListener('scroll', () => {
    if (!rafPending) { rafPending = true; requestAnimationFrame(update) }
  }, { passive: true })
  update()
}
