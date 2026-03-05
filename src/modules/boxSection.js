/**
 * modules/boxSection.js
 *
 * Proporciones 2 × 2 × 1 escaladas × 2.5 → 5 × 5 × 2.5 unidades Three.js.
 *
 * RETORNA un BoxController con funciones llamables para controlar la caja
 * desde cualquier lugar del código (scrollController, keyframes, botones, etc.)
 *
 * ── API del BoxController ────────────────────────────────────────────────
 *
 *  Transformaciones directas (sin animación):
 *    setPosition(x, y, z)   — mueve el grupo de la caja
 *    setRotation(x, y, z)   — rota el grupo de la caja (radianes)
 *    setScale(s)            — escala uniforme
 *    setLidAngle(t)         — tapa: t=0 cerrada, t=1 completamente abierta
 *    setFlapAngle(t)        — solapa: t=0 cerrada, t=1 completamente abierta
 *    show() / hide()        — visibilidad del grupo
 *
 *  Animaciones GSAP (retornan un tween/timeline para encadenar):
 *    rise(duration?, ease?)      — sube la caja a su posición final
 *    lower(duration?, ease?)     — baja la caja fuera de la vista
 *    openLid(duration?, ease?)   — abre tapa + solapa
 *    closeLid(duration?, ease?)  — cierra tapa + solapa
 *
 *  Secuencia completa original (scroll-driven):
 *    playFull()    — ejecuta la secuencia: subir → abrir → esperar → cerrar
 *    reverseFull() — revierte la secuencia
 *
 *  Referencia Three.js:
 *    group        — THREE.Group raíz de la caja (acceso directo)
 *    lidPivot     — pivot de la tapa
 *    flapPivot    — pivot de la solapa
 */

import * as THREE        from 'three'
import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ── Proporciones de la caja ───────────────────────────────────────────────
const W = 6.0   // ancho
const H = 3.0   // alto
const D = 6.0   // profundidad
const T = 0.10  // grosor de pared

// Posición Y final de la caja en el espacio de escena
const BOX_Y_FINAL = -5.0

// Ángulos máximos normalizados (t = 1 → completamente abierto)
const LID_OPEN_ANGLE  = -Math.PI * 0.88   // ≈ 158°
const FLAP_OPEN_ANGLE =  Math.PI * 0.55

export function initBoxSection(scene) {
  const sectionEl = document.getElementById('box-section')
  if (!sectionEl) return null

  // ── Materiales ────────────────────────────────────────────────────────
  const outerMat = new THREE.MeshStandardMaterial({
    color:     0x1a3020,
    roughness: 0.55,
    metalness: 0.15,
  })
  const innerMat = new THREE.MeshStandardMaterial({
    color:     0x2d5038,
    roughness: 0.75,
    metalness: 0.05,
    side: THREE.BackSide,
  })

  // ── Grupo raíz ────────────────────────────────────────────────────────
  const boxGroup = new THREE.Group()
  boxGroup.position.set(0, BOX_Y_FINAL - 18, 0)  // empieza muy abajo
  scene.add(boxGroup)

  // Helper — panel plano
  const panel = (w, h, d, px, py, pz, mat = outerMat) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat)
    m.position.set(px, py, pz)
    m.castShadow    = true
    m.receiveShadow = true
    boxGroup.add(m)
    return m
  }

  // ── Cinco paredes (sin tapa — la cubre el lid) ────────────────────────
  panel(W,   T,   D,        0,      -H / 2,  0)    // fondo
  panel(W,   H,   T,        0,       0,       D / 2)  // frente
  panel(W,   H,   T,        0,       0,      -D / 2)  // trasera
  panel(T,   H,   D,       -W / 2,   0,       0)    // izquierda
  panel(T,   H,   D,        W / 2,   0,       0)    // derecha

  // Carcasa interior (visible cuando el lid está abierto)
  const innerShell = new THREE.Mesh(
    new THREE.BoxGeometry(W - T * 2, H - T, D - T * 2),
    innerMat,
  )
  innerShell.position.set(0, T / 2, 0)
  boxGroup.add(innerShell)

  // ── Tapa — pivota por su borde posterior superior ─────────────────────
  const lidPivot = new THREE.Group()
  lidPivot.position.set(0, H / 2, -D / 2)
  boxGroup.add(lidPivot)

  const lidMesh = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), outerMat)
  lidMesh.position.set(0, 0, D / 2)
  lidMesh.castShadow = true
  lidPivot.add(lidMesh)

  // ── Solapa frontal ────────────────────────────────────────────────────
  const flapPivot = new THREE.Group()
  flapPivot.position.set(0, H / 2, D / 2)
  boxGroup.add(flapPivot)

  const flapMesh = new THREE.Mesh(
    new THREE.BoxGeometry(W, T, D * 0.35),
    outerMat,
  )
  flapMesh.position.set(0, 0, -D * 0.175)
  flapPivot.add(flapMesh)

  // ── Timeline de la secuencia completa ─────────────────────────────────
  const tl = gsap.timeline({ paused: true })

  tl.to(boxGroup.position, {
    y: BOX_Y_FINAL, duration: 1.2, ease: 'power3.out',
  }, 0)

  tl.to(lidPivot.rotation, {
    x: LID_OPEN_ANGLE, duration: 1.1, ease: 'power2.inOut',
  }, 0.8)
  tl.to(flapPivot.rotation, {
    x: FLAP_OPEN_ANGLE, duration: 0.8, ease: 'power2.inOut',
  }, 0.9)

  tl.to({}, { duration: 1.6 }, 2.0)   // espera con tapa abierta

  tl.to(flapPivot.rotation, {
    x: 0, duration: 0.7, ease: 'power2.inOut',
  }, 3.6)
  tl.to(lidPivot.rotation, {
    x: 0, duration: 1.0, ease: 'power2.inOut',
  }, 3.8)

  // ── ScrollTrigger del #box-section ───────────────────────────────────
  ScrollTrigger.create({
    trigger:     sectionEl,
    start:       'top 85%',
    end:         'bottom 15%',
    onEnter:     () => tl.play(),
    onLeave:     () => tl.reverse(),
    onEnterBack: () => tl.play(),
    onLeaveBack: () => tl.reverse(),
  })

  // ── BoxController — API pública ───────────────────────────────────────
  return {
    /** THREE.Group raíz — acceso directo para transforms manuales */
    group:     boxGroup,
    lidPivot,
    flapPivot,

    // ── Transformaciones directas (sin animación) ───────────────────────
    setPosition(x, y, z) { boxGroup.position.set(x, y, z) },
    setRotation(x, y, z) { boxGroup.rotation.set(x, y, z) },
    setScale(s)          { boxGroup.scale.setScalar(s) },

    /**
     * t = 0 → tapa cerrada  /  t = 1 → tapa completamente abierta
     * Puedes usar valores intermedios para posiciones parciales.
     */
    setLidAngle(t)  { lidPivot.rotation.x  = t * LID_OPEN_ANGLE  },
    setFlapAngle(t) { flapPivot.rotation.x = t * FLAP_OPEN_ANGLE },

    show() { boxGroup.visible = true  },
    hide() { boxGroup.visible = false },

    // ── Animaciones GSAP individuales ──────────────────────────────────
    /**
     * Sube la caja a su posición final.
     * @param {number} duration  segundos (default 1.2)
     * @param {string} ease      GSAP ease (default 'power3.out')
     * @returns GSAP tween
     */
    rise(duration = 1.2, ease = 'power3.out') {
      return gsap.to(boxGroup.position, { y: BOX_Y_FINAL, duration, ease })
    },

    /**
     * Baja la caja fuera de la vista.
     * @param {number} duration  segundos (default 1.2)
     * @param {string} ease      GSAP ease (default 'power3.in')
     * @returns GSAP tween
     */
    lower(duration = 1.2, ease = 'power3.in') {
      return gsap.to(boxGroup.position, { y: BOX_Y_FINAL - 18, duration, ease })
    },

    /**
     * Abre tapa y solapa con animación.
     * @param {number} duration  segundos de la tapa (default 1.1)
     * @param {string} ease      GSAP ease (default 'power2.inOut')
     * @returns GSAP timeline
     */
    openLid(duration = 1.1, ease = 'power2.inOut') {
      return gsap.timeline()
        .to(lidPivot.rotation,  { x: LID_OPEN_ANGLE,  duration,           ease })
        .to(flapPivot.rotation, { x: FLAP_OPEN_ANGLE, duration: duration * 0.72, ease }, 0.1)
    },

    /**
     * Cierra tapa y solapa con animación.
     * @param {number} duration  segundos de la tapa (default 1.0)
     * @param {string} ease      GSAP ease (default 'power2.inOut')
     * @returns GSAP timeline
     */
    closeLid(duration = 1.0, ease = 'power2.inOut') {
      return gsap.timeline()
        .to(flapPivot.rotation, { x: 0, duration: duration * 0.7, ease })
        .to(lidPivot.rotation,  { x: 0, duration,                 ease }, 0.2)
    },

    // ── Secuencia completa (la original scroll-driven) ─────────────────
    /** Ejecuta la secuencia: subir → abrir → esperar → cerrar */
    playFull()    { tl.play()    },
    /** Revierte la secuencia completa */
    reverseFull() { tl.reverse() },
  }
}
