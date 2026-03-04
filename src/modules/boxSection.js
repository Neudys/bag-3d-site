/**
 * modules/boxSection.js
 *
 * Proportions 2 × 2 × 1 (width × height × depth) scaled × 2.5 → 5 × 5 × 2.5
 * Three.js world units.  The bag model is already at the screen bottom (y ≈ −5.5)
 * from the scroll-stage animation, so the box rises from below to surround it.
 *
 * Animation sequence (auto-plays on ScrollTrigger enter, reverses on leave):
 *  1. Box group rises from far below into position centred on the bag
 *  2. Lid (hinged at the back-top edge) swings open 160°
 *  3. Hold open → bag visible inside
 *  4. Lid swings closed
 *
 * Geometry layout (all in box-group local space, centre at origin):
 *
 *   ┌──── lid (W × T × D) — pivot at back-top edge ────┐
 *   │ front  │      open interior       │  back  │
 *   │  wall  │                          │  wall  │
 *   │        │   bag sits here (y≈0)   │        │
 *   └──────────────── bottom ──────────────────────────┘
 */

import * as THREE from 'three'
import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Box proportions  2 : 2 : 1  scaled to scene units
const W = 5.0   // width
const H = 5.0   // height
const D = 2.5   // depth
const T = 0.10  // wall thickness

// Box Y centre in scene space — bag rests at y ≈ −5.5 so we centre on it
const BOX_Y_FINAL = -5.0

export function initBoxSection(scene) {
  const sectionEl = document.getElementById('box-section')
  if (!sectionEl) return

  // ── Materials ──────────────────────────────────────────────────────────
  const outerMat = new THREE.MeshStandardMaterial({
    color:     0x1a3020,   // brand dark green
    roughness: 0.55,
    metalness: 0.15,
  })
  const innerMat = new THREE.MeshStandardMaterial({
    color:     0x2d5038,   // slightly lighter inside
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.BackSide,
  })

  // ── Box group (all pieces parented here) ──────────────────────────────
  const boxGroup = new THREE.Group()
  // Start far below viewport — will rise on scroll trigger
  boxGroup.position.set(0, BOX_Y_FINAL - 18, 0)
  scene.add(boxGroup)

  // Helper — thin box panel
  const panel = (w, h, d, px, py, pz, mat = outerMat) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(px, py, pz)
    m.castShadow = true
    m.receiveShadow = true
    boxGroup.add(m)
    return m
  }

  // ── Five walls (no top — lid covers it) ───────────────────────────────
  panel(W,       T,       D,       0,      -H / 2, 0)          // bottom
  panel(W,       H,       T,       0,       0,      D / 2)     // front
  panel(W,       H,       T,       0,       0,     -D / 2)     // back
  panel(T,       H,       D,      -W / 2,  0,       0)         // left
  panel(T,       H,       D,       W / 2,  0,       0)         // right

  // Interior shell (visible from above when lid is open)
  const innerShell = new THREE.Mesh(
    new THREE.BoxGeometry(W - T * 2, H - T, D - T * 2),
    innerMat
  )
  innerShell.position.set(0, T / 2, 0)
  boxGroup.add(innerShell)

  // ── Lid — pivots around its back-top edge ─────────────────────────────
  // Pivot group sits at the back-top edge of the box opening
  const lidPivot = new THREE.Group()
  lidPivot.position.set(0, H / 2, -D / 2)
  boxGroup.add(lidPivot)

  // Lid mesh offset so its back edge aligns with the pivot
  const lidMesh = new THREE.Mesh(
    new THREE.BoxGeometry(W, T, D),
    outerMat
  )
  lidMesh.position.set(0, 0, D / 2)   // front edge is +D/2 from pivot
  lidMesh.castShadow = true
  lidPivot.add(lidMesh)

  // Front flap (small inner flap for realism)
  const flapPivot = new THREE.Group()
  flapPivot.position.set(0, H / 2, D / 2)
  boxGroup.add(flapPivot)

  const flapMesh = new THREE.Mesh(
    new THREE.BoxGeometry(W, T, D * 0.35),
    outerMat
  )
  flapMesh.position.set(0, 0, -D * 0.175)
  flapPivot.add(flapMesh)

  // ── ScrollTrigger — auto-play on enter, reverse on leave ──────────────
  const tl = gsap.timeline({ paused: true })

  // 1. Box rises into position
  tl.to(boxGroup.position, {
    y:        BOX_Y_FINAL,
    duration: 1.2,
    ease:     'power3.out',
  }, 0)

  // 2. Lid and front flap open simultaneously
  tl.to(lidPivot.rotation, {
    x:        -Math.PI * 0.88,   // 158° open
    duration: 1.1,
    ease:     'power2.inOut',
  }, 0.8)
  tl.to(flapPivot.rotation, {
    x:         Math.PI * 0.55,   // flap folds outward
    duration:  0.8,
    ease:      'power2.inOut',
  }, 0.9)

  // 3. Hold open
  tl.to({}, { duration: 1.6 }, 2.0)

  // 4. Close lid and flap
  tl.to(flapPivot.rotation, {
    x:        0,
    duration: 0.7,
    ease:     'power2.inOut',
  }, 3.6)
  tl.to(lidPivot.rotation, {
    x:        0,
    duration: 1.0,
    ease:     'power2.inOut',
  }, 3.8)

  ScrollTrigger.create({
    trigger:  sectionEl,
    start:    'top 85%',
    end:      'bottom 15%',
    onEnter:      () => tl.play(),
    onLeave:      () => tl.reverse(),
    onEnterBack:  () => tl.play(),
    onLeaveBack:  () => tl.reverse(),
  })
}
