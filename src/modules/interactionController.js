/**
 * modules/interactionController.js
 *
 * Mouse/touch driven lean + drift on the 3D model.
 *
 * Strategy (no scroll-controller conflict):
 *  - We track our OWN contribution (_leanX, _leanY).
 *  - Each frame we REMOVE the old contribution and ADD the new one.
 *  - scroll controller can safely set rotation.y/x at any time; we just
 *    nudge the final value without clobbering it.
 *  - During model transitions: reset lean so there's no offset carry-over.
 */

export class InteractionController {
  constructor(modelManager) {
    this.modelManager = modelManager

    this._target = { x: 0, y: 0 }   // raw normalised mouse [-1,+1]
    this._mouse  = { x: 0, y: 0 }   // lerped

    // How much each axis contributes
    this._maxLeanX  = 0.14   // rotation.x  (up/down tilt)
    this._maxLeanY  = 0.18   // rotation.y  (left/right lean ON TOP of scroll)
    this._maxDrift  = 0.10   // position.x  drift (Three.js units)

    // Our previous contribution — subtracted before adding new value
    this._leanX = 0
    this._leanY = 0

    this._isMobile = window.innerWidth < 768

    this._onMouseMove = this._handleMouseMove.bind(this)
    this._onTouchMove = this._handleTouchMove.bind(this)
  }

  init() {
    window.addEventListener('mousemove', this._onMouseMove)
    window.addEventListener('touchmove', this._onTouchMove, { passive: true })
  }

  _handleMouseMove(e) {
    this._target.x =  (e.clientX / window.innerWidth)  * 2 - 1
    this._target.y = -((e.clientY / window.innerHeight) * 2 - 1)
  }

  _handleTouchMove(e) {
    if (!e.touches[0]) return
    this._target.x =  (e.touches[0].clientX / window.innerWidth)  * 2 - 1
    this._target.y = -((e.touches[0].clientY / window.innerHeight) * 2 - 1)
  }

  tick() {
    if (this._isMobile) return

    const model  = this.modelManager.getCurrentModel()
    const config = this.modelManager.getCurrentConfig()
    if (!model || !config) return

    // Always lerp the mouse so it stays smooth
    const k = 0.055
    this._mouse.x += (this._target.x - this._mouse.x) * k
    this._mouse.y += (this._target.y - this._mouse.y) * k

    // During transitions: zero out our lean so it doesn't accumulate
    if (this.modelManager.isTransitioning) {
      this._leanX = 0
      this._leanY = 0
      return
    }

    const newLeanX = -this._mouse.y * this._maxLeanX
    const newLeanY =  this._mouse.x * this._maxLeanY

    // Delta-patch: remove old lean, add new lean on top of whatever scroll set
    model.rotation.x += newLeanX - this._leanX
    model.rotation.y += newLeanY - this._leanY

    this._leanX = newLeanX
    this._leanY = newLeanY

    // Subtle position drift — scroll controller only owns position.y, so X is safe
    model.position.x = config.modelPosition[0] + this._mouse.x * this._maxDrift
  }

  onResize() {
    this._isMobile = window.innerWidth < 768
  }

  dispose() {
    window.removeEventListener('mousemove', this._onMouseMove)
    window.removeEventListener('touchmove', this._onTouchMove)
  }
}
