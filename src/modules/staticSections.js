/**
 * modules/staticSections.js
 *
 * Zipper transition + scroll-reveal for the static sections
 * (eco-values, accessories, contact form).
 *
 * Zipper:  horizontal zipper that opens left → right.
 *          The slider travels RIGHT along the horizontal seam.
 *          Behind the slider (to its LEFT), two fabric flaps peel away:
 *            – top flap curves UPWARD
 *            – bottom flap curves DOWNWARD
 *          Maximum opening is at the LEFT edge of the viewport;
 *          the gap tapers smoothly to ZERO at the slider position.
 *          This matches the natural look of unzipping fabric.
 *
 * Reveal:  IntersectionObserver adds .reveal--visible to .reveal elements.
 */

export function initStaticSections() {
  initZipper()
  initScrollReveal()
  initAccessoriesArrows()
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

    // Phase 1 (0 → ZIPPER_RETRACT_AT): lens opens left→right
    // Phase 2 (ZIPPER_RETRACT_AT → 1):  flaps retract off screen
    const lensP   = Math.min(1, progress / ZIPPER_RETRACT_AT)
    const sliderX = W * lensP

    // Opening height at the LEFT edge — eased so it opens quickly
    const eased   = 1 - Math.pow(1 - lensP, 2)
    const maxOpen = H * ZIPPER_MAX_OPEN * eased

    // ── KEY SHAPE: Opening is at the LEFT, closing at the SLIDER ──────────
    //
    //  Left edge (x=0):    gap = maxOpen  (fabric fully peeled away)
    //  Slider (x=sliderX): gap = 0        (fabric still closed)
    //
    //  Top curve:  from (sliderX, CY)  →  curving UP  →  to (0, CY - maxOpen)
    //  Bot curve:  from (sliderX, CY)  →  curving DOWN →  to (0, CY + maxOpen)
    //
    //  The control points shape the curve so it stays close to CY near the
    //  slider (tight, just starting to peel) and sweeps open near the left
    //  edge (fabric under full tension). This mimics real zipper fabric.

    // Top arch: from slider (closed) → left edge (open upward)
    const tp0 = { x: sliderX,           y: CY }
    const tp1 = { x: sliderX * 0.65,    y: CY - maxOpen * 0.05 }   // stays near CY close to slider
    const tp2 = { x: sliderX * 0.20,    y: CY - maxOpen * 0.85 }   // swings up near left edge
    const tp3 = { x: 0,                 y: CY - maxOpen }           // full opening at left

    // Bottom arch: mirror of top
    const bp0 = { x: sliderX,           y: CY }
    const bp1 = { x: sliderX * 0.65,    y: CY + maxOpen * 0.05 }
    const bp2 = { x: sliderX * 0.20,    y: CY + maxOpen * 0.85 }
    const bp3 = { x: 0,                 y: CY + maxOpen }

    // ── Top flap path ─────────────────────────────────────────────────────
    // Covers: top-left corner → top-right corner → right side down to CY →
    //         slider point (CY) → Bézier curve up to left edge → back to top-left
    const topD = [
      `M 0 0`,                                               // top-left corner
      `L ${W} 0`,                                             // top-right corner
      `L ${W} ${CY}`,                                         // right edge at center
      `L ${sliderX.toFixed(1)} ${CY}`,                        // horizontal seam to slider
      `C ${tp1.x.toFixed(1)} ${tp1.y.toFixed(1)}`,           // curve from slider...
      `  ${tp2.x.toFixed(1)} ${tp2.y.toFixed(1)}`,
      `  ${tp3.x.toFixed(1)} ${tp3.y.toFixed(1)}`,           // ...to left edge (open)
      `L 0 0 Z`,                                              // up to top-left corner
    ].join(' ')
    flapTop.setAttribute('d', topD)

    // ── Bottom flap path ──────────────────────────────────────────────────
    const botD = [
      `M 0 ${H}`,                                             // bottom-left corner
      `L ${W} ${H}`,                                           // bottom-right corner
      `L ${W} ${CY}`,                                          // right edge at center
      `L ${sliderX.toFixed(1)} ${CY}`,                         // horizontal seam to slider
      `C ${bp1.x.toFixed(1)} ${bp1.y.toFixed(1)}`,            // curve from slider...
      `  ${bp2.x.toFixed(1)} ${bp2.y.toFixed(1)}`,
      `  ${bp3.x.toFixed(1)} ${bp3.y.toFixed(1)}`,            // ...to left edge (open)
      `L 0 ${H} Z`,                                            // down to bottom-left corner
    ].join(' ')
    flapBot.setAttribute('d', botD)

    // ── Seam: closed portion from slider to right edge ────────────────────
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

    // ── Teeth along the arch curves ───────────────────────────────────────
    if (lensP > 0.03 && maxOpen > 4) {
      drawTeeth(teethTopG, tp0, tp1, tp2, tp3, true)
      drawTeeth(teethBotG, bp0, bp1, bp2, bp3, false)
    } else {
      teethTopG.innerHTML = ''
      teethBotG.innerHTML = ''
    }

    // ── Slider: sits at the convergence point (sliderX, CY) ──────────────
    if (slider) {
      slider.style.transform =
        `translate(${(sliderX - 28).toFixed(1)}px, ${(CY - 19).toFixed(1)}px)`
    }

    // ── Phase 2: flaps retract completely off screen ──────────────────────
    // Top flap slides UP by CY px → its bottom edge (at CY) reaches y=0 → invisible.
    // Bottom flap slides DOWN by (H-CY) px → its top edge (at CY) reaches y=H → invisible.
    const retractRaw  = Math.max(0, (progress - ZIPPER_RETRACT_AT) / (1 - ZIPPER_RETRACT_AT))
    const retractEase = retractRaw * retractRaw   // ease-in for snappy finish

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

/* ── Accessories carousel arrows ─────────────────────────────────────────── */

function initAccessoriesArrows() {
  const grid = document.querySelector('.accessories-grid')
  const prev = document.querySelector('.acc-arrow--prev')
  const next = document.querySelector('.acc-arrow--next')
  if (!grid || !prev || !next) return

  const scrollBy = () => grid.querySelector('.product-card')?.offsetWidth + 24 || 300

  prev.addEventListener('click', () => grid.scrollBy({ left: -scrollBy(), behavior: 'smooth' }))
  next.addEventListener('click', () => grid.scrollBy({ left:  scrollBy(), behavior: 'smooth' }))
}

/* ── Scroll reveal (IntersectionObserver) ────────────────────────────────── */

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold:  0.12,
    rootMargin: '0px 0px -48px 0px',
  })

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
}