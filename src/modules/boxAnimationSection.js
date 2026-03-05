/**
 * modules/boxAnimationSection.js
 *
 * Lee boxAnimationConfig.js y aplica los estados interpolados al modelo,
 * cámara y caja según el progreso del scroll en .box-anim-scroll-track.
 *
 * NO EDITAR — toda la configuración va en src/config/boxAnimationConfig.js
 */

import * as THREE        from 'three'
import { gsap }          from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { boxAnimationConfig } from '../config/boxAnimationConfig.js'

gsap.registerPlugin(ScrollTrigger)

// ── Helpers ───────────────────────────────────────────────────────────────────

function lerp(a, b, t) { return a + (b - a) * t }

/**
 * Dado el array de progress y un valor p, devuelve el par de índices
 * adyacentes y el t normalizado entre ellos.
 */
function findSegment(progress, p) {
  const last = progress.length - 1
  if (p <= progress[0])    return { i: 0,        t: 0 }
  if (p >= progress[last]) return { i: last - 1, t: 1 }

  let i = 0
  while (i < last - 1 && progress[i + 1] <= p) i++

  const t = (p - progress[i]) / (progress[i + 1] - progress[i])
  return { i, t }
}

/** Interpola entre arr[i] y arr[i+1] con factor t (arrays [x,y,z]). */
function lerpVec(arr, i, t) {
  return [
    lerp(arr[i][0], arr[i + 1][0], t),
    lerp(arr[i][1], arr[i + 1][1], t),
    lerp(arr[i][2], arr[i + 1][2], t),
  ]
}

/** Interpola entre arr[i] y arr[i+1] con factor t (valores escalares). */
function lerpVal(arr, i, t) {
  return lerp(arr[i], arr[i + 1], t)
}

// ── Init ──────────────────────────────────────────────────────────────────────

export function initBoxAnimationSection(camera, modelManager, scrollController, interaction, box) {
  const cfg     = boxAnimationConfig
  const trackEl = document.querySelector('.box-anim-scroll-track')
  if (!trackEl) {
    console.warn('[boxAnimationSection] .box-anim-scroll-track not found')
    return
  }

  trackEl.style.height = cfg.scrollHeight

  const lookAtVec = new THREE.Vector3()

  function getModelCfg() {
    const id = modelManager.getCurrentConfig()?.id
    return cfg.models[id] ?? cfg.models.default
  }

  function applyState(p) {
    const mc = getModelCfg()
    const { i, t } = findSegment(mc.progress, p)

    // ── Bolsa ────────────────────────────────────────────────────────────────
    const model = modelManager.getCurrentModel()
    if (model) {
      const pos = lerpVec(mc.model.position, i, t)
      const rot = lerpVec(mc.model.rotation, i, t)
      model.position.set(pos[0], pos[1], pos[2])
      model.rotation.set(rot[0], rot[1], rot[2])
      if (mc.model.scale) {
        const s = lerpVal(mc.model.scale, i, t)
        model.scale.setScalar(s)
      }
    }

    // ── Cámara ───────────────────────────────────────────────────────────────
    const cPos  = lerpVec(mc.camera.position, i, t)
    const cLook = lerpVec(mc.camera.lookAt,   i, t)
    camera.position.set(cPos[0], cPos[1], cPos[2])
    lookAtVec.set(cLook[0], cLook[1], cLook[2])
    camera.lookAt(lookAtVec)

    // ── Caja ─────────────────────────────────────────────────────────────────
    if (box) {
      const bPos = lerpVec(mc.box.position, i, t)
      const bRot = lerpVec(mc.box.rotation, i, t)
      box.setPosition(bPos[0], bPos[1], bPos[2])
      box.setRotation(bRot[0], bRot[1], bRot[2])
      box.setLidAngle( lerpVal(mc.box.lidAngle,  i, t))
      box.setFlapAngle(lerpVal(mc.box.flapAngle, i, t))
    }
  }

  // ── ScrollTrigger ─────────────────────────────────────────────────────────
  ScrollTrigger.create({
    trigger:  trackEl,
    start:    'top bottom',
    end:      'bottom top',
    scrub:    2.5,

    onEnter()     { scrollController.disable(); interaction.disable() },
    onLeave()     { scrollController.enable();  interaction.enable()  },
    onEnterBack() { scrollController.disable(); interaction.disable() },
    onLeaveBack() { scrollController.enable();  interaction.enable()  },

    onUpdate(self) { applyState(self.progress) },
  })
}
