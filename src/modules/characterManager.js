/**
 * modules/characterManager.js
 * MANA-style illustrated elements scattered behind the bag.
 * Pure inline SVG — zero deps, fast load, fully responsive.
 * Each bag config gets its own cast of decorative characters.
 */

// ── SVG Primitives ─────────────────────────────────────────────────────────

const svg = (w, h, body) =>
  `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none" xmlns="http://www.w3.org/2000/svg">${body}</svg>`

/** Organic blob creature with kawaii face + pattern */
function blobCreature(bodyCol, patternCol, cheekCol = '#e86050') {
  return svg(240, 300, `
    <path d="M22 210 Q2 148 36 84 Q68 20 120 20 Q175 20 208 82 Q242 146 220 210 Q198 274 120 278 Q42 282 22 210Z" fill="${bodyCol}"/>
    <circle cx="90"  cy="126" r="17" fill="#fff" opacity="0.95"/>
    <circle cx="152" cy="126" r="17" fill="#fff" opacity="0.95"/>
    <circle cx="93"  cy="129" r="9"  fill="#16200e"/>
    <circle cx="155" cy="129" r="9"  fill="#16200e"/>
    <circle cx="96"  cy="125" r="3.5" fill="#fff" opacity="0.7"/>
    <circle cx="158" cy="125" r="3.5" fill="#fff" opacity="0.7"/>
    <path d="M98 156 Q121 176 144 156" stroke="#16200e" stroke-width="5" stroke-linecap="round" fill="none"/>
    <ellipse cx="70"  cy="150" rx="14" ry="8" fill="${cheekCol}" opacity="0.38"/>
    <ellipse cx="170" cy="150" rx="14" ry="8" fill="${cheekCol}" opacity="0.38"/>
    <path d="M24 186 Q-4 172 0 148" stroke="${bodyCol}" stroke-width="26" stroke-linecap="round" fill="none"/>
    <path d="M216 186 Q244 172 240 148" stroke="${bodyCol}" stroke-width="26" stroke-linecap="round" fill="none"/>
    <ellipse cx="0"   cy="146" rx="12" ry="8"  fill="${patternCol}" opacity="0.8" transform="rotate(-15 0 146)"/>
    <ellipse cx="240" cy="146" rx="12" ry="8"  fill="${patternCol}" opacity="0.8" transform="rotate(15 240 146)"/>
    <circle cx="90"  cy="218" r="9" fill="${patternCol}" opacity="0.6"/>
    <circle cx="120" cy="242" r="7" fill="${patternCol}" opacity="0.5"/>
    <circle cx="152" cy="216" r="9" fill="${patternCol}" opacity="0.6"/>
    <path d="M108 192 Q113 184 119 190 Q124 184 130 192 Q125 204 119 210 Q113 204 108 192Z" fill="${patternCol}" opacity="0.55"/>
  `)
}

/** 8-point star burst with optional face */
function starBurst(col, hasFace = true) {
  return svg(180, 180, `
    <polygon points="90,6 104,58 155,44 128,88 175,102 128,120 155,165 104,150 90,174 76,150 25,165 52,120 5,102 52,88 25,44 76,58" fill="${col}"/>
    ${hasFace ? `
      <circle cx="77" cy="92" r="7.5" fill="rgba(0,0,0,0.55)"/>
      <circle cx="103" cy="92" r="7.5" fill="rgba(0,0,0,0.55)"/>
      <path d="M74 107 Q90 120 106 107" stroke="rgba(0,0,0,0.55)" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    ` : ''}
  `)
}

/** Sky oval — blue with white puffy clouds */
function skyOval() {
  return svg(230, 175, `
    <rect x="4" y="4" width="222" height="167" rx="83" fill="#6bbde8"/>
    <ellipse cx="62"  cy="70" r="28"  fill="#fff" opacity="0.92"/>
    <ellipse cx="88"  cy="58" r="24"  fill="#fff" opacity="0.92"/>
    <ellipse cx="112" cy="65" r="22"  fill="#fff" opacity="0.92"/>
    <rect    x="40" y="68" width="94"  height="28" rx="4" fill="#fff" opacity="0.92"/>
    <ellipse cx="158" cy="114" r="22" fill="#fff" opacity="0.86"/>
    <ellipse cx="180" cy="106" r="18" fill="#fff" opacity="0.86"/>
    <ellipse cx="196" cy="112" r="16" fill="#fff" opacity="0.86"/>
    <rect    x="143" y="112" width="68" height="22" rx="4" fill="#fff" opacity="0.86"/>
  `)
}

/** Simple round-petal flower */
function flower(petalCol, centerCol = '#f0e040') {
  return svg(150, 150, `
    <ellipse cx="75" cy="28"  rx="24" ry="32" fill="${petalCol}"/>
    <ellipse cx="75" cy="122" rx="24" ry="32" fill="${petalCol}"/>
    <ellipse cx="28" cy="75"  rx="32" ry="24" fill="${petalCol}"/>
    <ellipse cx="122" cy="75" rx="32" ry="24" fill="${petalCol}"/>
    <ellipse cx="41"  cy="41"  rx="22" ry="30" fill="${petalCol}" transform="rotate(45 41 41)"/>
    <ellipse cx="109" cy="41"  rx="22" ry="30" fill="${petalCol}" transform="rotate(-45 109 41)"/>
    <ellipse cx="41"  cy="109" rx="22" ry="30" fill="${petalCol}" transform="rotate(-45 41 109)"/>
    <ellipse cx="109" cy="109" rx="22" ry="30" fill="${petalCol}" transform="rotate(45 109 109)"/>
    <circle cx="75" cy="75" r="26"  fill="${centerCol}"/>
    <circle cx="75" cy="75" r="14"  fill="${petalCol}" opacity="0.5"/>
  `)
}

/** Botanical leaf cluster */
function leafCluster(col) {
  return svg(200, 220, `
    <path d="M100 200 Q90 150 60 120 Q30 90 50 50 Q70 10 110 30 Q100 80 100 120 Q100 160 100 200Z" fill="${col}"/>
    <path d="M100 200 Q110 150 140 120 Q170 90 150 50 Q130 10 90 30 Q100 80 100 120 Q100 160 100 200Z" fill="${col}" opacity="0.8"/>
    <path d="M100 180 Q70 140 80 90 Q70 50 100 40" stroke="#fff" stroke-width="2" fill="none" opacity="0.4"/>
    <path d="M100 170 Q80 135 85 95" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.3"/>
    <path d="M100 170 Q120 135 115 95" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.3"/>
    <ellipse cx="55" cy="80" rx="30" ry="18" fill="${col}" transform="rotate(-35 55 80)"/>
    <ellipse cx="148" cy="75" rx="28" ry="16" fill="${col}" opacity="0.85" transform="rotate(35 148 75)"/>
  `)
}

/** Whale character */
function whale(col) {
  return svg(200, 150, `
    <path d="M6 78 Q26 58 28 78 Q28 95 6 84Z" fill="${col}" opacity="0.82"/>
    <ellipse cx="108" cy="85" rx="78" ry="50" fill="${col}" opacity="0.9"/>
    <ellipse cx="112" cy="94" rx="54" ry="28" fill="#d8f2ff" opacity="0.38"/>
    <path d="M108 37 Q122 20 136 34 Q124 40 108 40Z" fill="${col}" opacity="0.85"/>
    <circle cx="156" cy="76" r="9.5" fill="#fff" opacity="0.95"/>
    <circle cx="158" cy="76" r="5.5" fill="#08182a"/>
    <circle cx="160" cy="74" r="2"   fill="#fff"  opacity="0.8"/>
    <path d="M148 90 Q160 100 170 92" stroke="#08182a" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <ellipse cx="140" cy="87" rx="9" ry="5" fill="#60a0d0" opacity="0.3"/>
    <path d="M148 36 Q146 20 150 12" stroke="${col}" stroke-width="5" stroke-linecap="round" fill="none" opacity="0.75"/>
    <path d="M148 36 Q140 20 142 10" stroke="${col}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.65"/>
    <path d="M148 36 Q156 20 154 10" stroke="${col}" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.65"/>
    <path d="M82 128 Q78 145 62 140 Q70 130 78 128Z" fill="${col}" opacity="0.75"/>
  `)
}

/** Jellyfish */
function jellyfish(col) {
  return svg(100, 170, `
    <path d="M8 65 Q8 18 50 16 Q92 18 92 65 Q92 82 50 87 Q8 82 8 65Z" fill="${col}" opacity="0.86"/>
    <path d="M20 60 Q20 40 50 38 Q80 40 80 60" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.3"/>
    <path d="M22 38 Q30 26 46 28 Q36 36 22 38Z" fill="#fff" opacity="0.28"/>
    <circle cx="38" cy="58" r="6"  fill="#fff" opacity="0.95"/>
    <circle cx="62" cy="58" r="6"  fill="#fff" opacity="0.95"/>
    <circle cx="39" cy="59" r="3"  fill="#0a1420"/>
    <circle cx="63" cy="59" r="3"  fill="#0a1420"/>
    <path d="M36 72 Q50 82 64 72" stroke="#0a1420" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M26 87 Q20 108 26 128 Q32 148 26 166" stroke="${col}" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.72"/>
    <path d="M38 88 Q34 110 38 130 Q42 152 36 168" stroke="${col}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.62"/>
    <path d="M50 89 Q50 112 50 132 Q50 154 50 168" stroke="${col}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.67"/>
    <path d="M62 88 Q66 110 62 130 Q58 152 64 168" stroke="${col}" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.62"/>
    <path d="M74 87 Q80 108 74 128 Q68 148 74 166" stroke="${col}" stroke-width="4.5" stroke-linecap="round" fill="none" opacity="0.72"/>
  `)
}

/** Cherry cluster */
function cherryCluster(col) {
  return svg(130, 160, `
    <path d="M65 50 Q72 28 88 22 Q95 36 82 46Z" fill="#4a8a30" stroke="#4a8a30" stroke-width="1"/>
    <path d="M65 50 Q58 28 42 22 Q35 36 48 46Z" fill="#4a8a30" stroke="#4a8a30" stroke-width="1"/>
    <path d="M65 50 Q65 35 65 28" stroke="#4a8a30" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <circle cx="88" cy="20" r="20" fill="${col}" opacity="0.92"/>
    <circle cx="42" cy="20" r="20" fill="${col}" opacity="0.88"/>
    <ellipse cx="82" cy="14" rx="7" ry="4.5" fill="#fff" opacity="0.35" transform="rotate(-20 82 14)"/>
    <ellipse cx="36" cy="14" rx="7" ry="4.5" fill="#fff" opacity="0.35" transform="rotate(-20 36 14)"/>
    <circle cx="65" cy="100" r="44" fill="${col}" opacity="0.9"/>
    <ellipse cx="52" cy="84" rx="11" ry="6.5" fill="#fff" opacity="0.35" transform="rotate(-20 52 84)"/>
    <circle cx="54" cy="102" r="5.5" fill="#fff" opacity="0.92"/>
    <circle cx="76" cy="102" r="5.5" fill="#fff" opacity="0.92"/>
    <circle cx="55" cy="103" r="3"   fill="#16080a"/>
    <circle cx="77" cy="103" r="3"   fill="#16080a"/>
    <path d="M52 115 Q65 126 78 115" stroke="#16080a" stroke-width="3" stroke-linecap="round" fill="none"/>
  `)
}

/** Cloud puff with little face */
function cloudPuff(col) {
  return svg(180, 140, `
    <circle cx="50"  cy="72" r="32"  fill="${col}" opacity="0.84"/>
    <circle cx="78"  cy="58" r="36"  fill="${col}" opacity="0.88"/>
    <circle cx="110" cy="62" r="30"  fill="${col}" opacity="0.84"/>
    <circle cx="134" cy="74" r="24"  fill="${col}" opacity="0.80"/>
    <circle cx="28"  cy="82" r="22"  fill="${col}" opacity="0.78"/>
    <rect   x="25" y="74" width="112" height="40" rx="4" fill="${col}" opacity="0.88"/>
    <circle cx="68"  cy="72" r="6.5" fill="#fff" opacity="0.95"/>
    <circle cx="94"  cy="72" r="6.5" fill="#fff" opacity="0.95"/>
    <circle cx="69"  cy="73" r="3.5" fill="#1a0820"/>
    <circle cx="95"  cy="73" r="3.5" fill="#1a0820"/>
    <path d="M64 86 Q81 98 98 86" stroke="#1a0820" stroke-width="3" stroke-linecap="round" fill="none"/>
    <ellipse cx="55" cy="82" rx="9" ry="5" fill="#ff80a0" opacity="0.32"/>
    <ellipse cx="107" cy="82" rx="9" ry="5" fill="#ff80a0" opacity="0.32"/>
    <rect x="55" y="112" width="13" height="26" rx="6.5" fill="${col}" opacity="0.8"/>
    <rect x="92" y="112" width="13" height="26" rx="6.5" fill="${col}" opacity="0.8"/>
  `)
}

/** Sparkling star */
function sparkStar(col) {
  return svg(130, 160, `
    <polygon points="65,10 78,52 120,52 86,76 98,118 65,94 32,118 44,76 10,52 52,52" fill="${col}" opacity="0.92"/>
    <polygon points="65,24 72,50 96,50 76,65 83,92 65,77 47,92 54,65 34,50 58,50" fill="${col}" opacity="0.42"/>
    <circle cx="56" cy="60" r="5.5" fill="rgba(0,0,0,0.5)"/>
    <circle cx="74" cy="60" r="5.5" fill="rgba(0,0,0,0.5)"/>
    <path d="M53 72 Q65 82 77 72" stroke="rgba(0,0,0,0.5)" stroke-width="3" stroke-linecap="round" fill="none"/>
    <text x="92" y="28" font-size="20" fill="${col}" opacity="0.7">✦</text>
    <text x="12" y="130" font-size="14" fill="${col}" opacity="0.55">✦</text>
  `)
}

/** Botanical stem with leaves */
function botanicalStem(col) {
  return svg(140, 240, `
    <path d="M70 230 Q65 190 60 150 Q55 110 70 60 Q75 20 80 10" stroke="${col}" stroke-width="7" stroke-linecap="round" fill="none" opacity="0.85"/>
    <ellipse cx="40" cy="90"  rx="38" ry="20" fill="${col}" opacity="0.82" transform="rotate(-35 40 90)"/>
    <ellipse cx="100" cy="130" rx="36" ry="19" fill="${col}" opacity="0.78" transform="rotate(30 100 130)"/>
    <ellipse cx="38"  cy="165" rx="32" ry="16" fill="${col}" opacity="0.75" transform="rotate(-28 38 165)"/>
    <ellipse cx="95"  cy="60"  rx="28" ry="14" fill="${col}" opacity="0.72" transform="rotate(20 95 60)"/>
    <path d="M68 92  Q48 82 40 92"   stroke="#fff" stroke-width="1.5" fill="none" opacity="0.3"/>
    <path d="M72 132 Q92 120 100 130" stroke="#fff" stroke-width="1.5" fill="none" opacity="0.3"/>
  `)
}

/** Small round berry cluster */
function berryCluster(col) {
  return svg(100, 100, `
    <circle cx="30" cy="60" r="22" fill="${col}" opacity="0.88"/>
    <circle cx="55" cy="45" r="22" fill="${col}" opacity="0.9"/>
    <circle cx="78" cy="62" r="20" fill="${col}" opacity="0.86"/>
    <circle cx="50" cy="72" r="18" fill="${col}" opacity="0.84"/>
    <circle cx="32" cy="55" r="5" fill="#fff" opacity="0.35"/>
    <circle cx="58" cy="40" r="5" fill="#fff" opacity="0.35"/>
    <path d="M55 25 Q60 8 70 5" stroke="#4a8a30" stroke-width="3.5" stroke-linecap="round" fill="none"/>
    <path d="M55 25 Q50 8 40 5" stroke="#4a8a30" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  `)
}

// ── Element position sets per model ────────────────────────────────────────
// Each element: { id, left, top, width, animClass, animDelay, side, zOffset }
// side: 'left' | 'right' — for parallax direction

const ELEMENT_SETS = {
  classic: [
    { id: 'creature',    left: '1%',  top: '12%',  width: '18vw', maxW: 240, animClass: 'char-bob',      delay: '0s',    side: 'left',  getSVG: () => blobCreature('#6daa6a', '#3a7a3a', '#e86050') },
    { id: 'starburst',   left: '28%', top: '-3%',  width: '13vw', maxW: 170, animClass: 'char-float',    delay: '0.3s',  side: 'left',  getSVG: () => starBurst('#f5c840') },
    { id: 'sky-oval',    left: '72%', top: '8%',   width: '18vw', maxW: 235, animClass: 'char-bob',      delay: '0.8s',  side: 'right', getSVG: () => skyOval() },
    { id: 'flower-r',    left: '76%', top: '48%',  width: '11vw', maxW: 145, animClass: 'char-sway',     delay: '0.5s',  side: 'right', getSVG: () => flower('#e87840', '#f5d040') },
    { id: 'stem-l',      left: '3%',  top: '62%',  width: '10vw', maxW: 130, animClass: 'char-sway',     delay: '0.6s',  side: 'left',  getSVG: () => botanicalStem('#4a8a30') },
    { id: 'stem-r',      left: '82%', top: '60%',  width: '10vw', maxW: 130, animClass: 'char-float',    delay: '1.0s',  side: 'right', getSVG: () => botanicalStem('#5a9a40') },
    { id: 'leaf-tl',     left: '18%', top: '78%',  width: '13vw', maxW: 170, animClass: 'char-wave',     delay: '0.4s',  side: 'left',  getSVG: () => leafCluster('#4a8a30') },
    { id: 'flower-bl',   left: '5%',  top: '76%',  width: '9vw',  maxW: 120, animClass: 'char-bob',      delay: '0.9s',  side: 'left',  getSVG: () => flower('#f0a840', '#f5d040') }
  ],

  rouge: [
    { id: 'creature',    left: '1%',  top: '12%',  width: '18vw', maxW: 240, animClass: 'char-bob',      delay: '0s',    side: 'left',  getSVG: () => blobCreature('#c94040', '#8a1010', '#ff90a0') },
    { id: 'starburst',   left: '28%', top: '-3%',  width: '13vw', maxW: 170, animClass: 'char-float',    delay: '0.3s',  side: 'left',  getSVG: () => starBurst('#f5a830') },
    { id: 'cherry-r',    left: '74%', top: '8%',   width: '11vw', maxW: 145, animClass: 'char-float',    delay: '0.5s',  side: 'right', getSVG: () => cherryCluster('#c94040') },
    { id: 'flower-r1',   left: '76%', top: '35%',  width: '11vw', maxW: 145, animClass: 'char-sway',     delay: '0.6s',  side: 'right', getSVG: () => flower('#e04040', '#f59840') },
    { id: 'flower-r2',   left: '82%', top: '60%',  width: '10vw', maxW: 130, animClass: 'char-bob',      delay: '0.9s',  side: 'right', getSVG: () => flower('#f07040', '#f5d040') },
    { id: 'stem-l',      left: '3%',  top: '58%',  width: '10vw', maxW: 130, animClass: 'char-sway',     delay: '0.7s',  side: 'left',  getSVG: () => botanicalStem('#8a2020') },
    { id: 'berries-bl',  left: '8%',  top: '76%',  width: '9vw',  maxW: 110, animClass: 'char-wave',     delay: '1.0s',  side: 'left',  getSVG: () => berryCluster('#c94040') },
    { id: 'sky-oval',    left: '71%', top: '68%',  width: '15vw', maxW: 190, animClass: 'char-float',    delay: '1.2s',  side: 'right', getSVG: () => skyOval() }
  ],

  rose: [
    { id: 'cloud',       left: '1%',  top: '18%',  width: '16vw', maxW: 210, animClass: 'char-float',    delay: '0s',    side: 'left',  getSVG: () => cloudPuff('#f0a0c4') },
    { id: 'starburst',   left: '26%', top: '-3%',  width: '12vw', maxW: 155, animClass: 'char-spin-idle',delay: '0.4s',  side: 'left',  getSVG: () => starBurst('#f5c8e0') },
    { id: 'flower-big',  left: '74%', top: '5%',   width: '13vw', maxW: 170, animClass: 'char-sway',     delay: '0.5s',  side: 'right', getSVG: () => flower('#d4709a', '#f0e040') },
    { id: 'star-r',      left: '80%', top: '40%',  width: '10vw', maxW: 130, animClass: 'char-spin-idle',delay: '0.7s',  side: 'right', getSVG: () => sparkStar('#f0a0c4') },
    { id: 'flower-sm',   left: '78%', top: '65%',  width: '9vw',  maxW: 120, animClass: 'char-bob',      delay: '0.9s',  side: 'right', getSVG: () => flower('#e078a8', '#f5e040') },
    { id: 'stem-l',      left: '4%',  top: '55%',  width: '10vw', maxW: 130, animClass: 'char-sway',     delay: '0.6s',  side: 'left',  getSVG: () => botanicalStem('#a04070') },
    { id: 'cloud-sm',    left: '6%',  top: '74%',  width: '13vw', maxW: 165, animClass: 'char-wave',     delay: '1.1s',  side: 'left',  getSVG: () => cloudPuff('#f0c8d8') }
  ],

  cobalt: [
    { id: 'whale',       left: '0%',  top: '50%',  width: '18vw', maxW: 230, animClass: 'char-wave',     delay: '0s',    side: 'left',  getSVG: () => whale('#3a70d0') },
    { id: 'sky-oval',    left: '70%', top: '5%',   width: '18vw', maxW: 235, animClass: 'char-float',    delay: '0.4s',  side: 'right', getSVG: () => skyOval() },
    { id: 'jelly-r',     left: '78%', top: '38%',  width: '9vw',  maxW: 115, animClass: 'char-float',    delay: '0.6s',  side: 'right', getSVG: () => jellyfish('#3a70d0') },
    { id: 'starburst',   left: '26%', top: '-3%',  width: '12vw', maxW: 155, animClass: 'char-bob',      delay: '0.3s',  side: 'left',  getSVG: () => starBurst('#70a8ff') },
    { id: 'jelly-l',     left: '4%',  top: '20%',  width: '8vw',  maxW: 105, animClass: 'char-float',    delay: '0.8s',  side: 'left',  getSVG: () => jellyfish('#6090d8') },
    { id: 'flower-bl',   left: '72%', top: '65%',  width: '10vw', maxW: 130, animClass: 'char-sway',     delay: '1.0s',  side: 'right', getSVG: () => flower('#5090e0', '#d0e8ff') },
    { id: 'berries',     left: '5%',  top: '70%',  width: '9vw',  maxW: 115, animClass: 'char-bob',      delay: '0.9s',  side: 'left',  getSVG: () => berryCluster('#3a70d0') }
  ]
}

// ── CharacterManager ───────────────────────────────────────────────────────

export class CharacterManager {
  constructor() {
    this.layer        = null
    this.elements     = []
    this.currentId    = null
    this._init()
  }

  _init() {
    const hero = document.getElementById('hero')
    if (!hero) return

    this.layer = document.createElement('div')
    this.layer.id = 'char-layer'
    this.layer.setAttribute('aria-hidden', 'true')

    const canvas = document.getElementById('canvas-container')
    hero.insertBefore(this.layer, canvas)
  }

  showFor(modelId, _accentColor, instant = false) {
    if (this.currentId === modelId && !instant) return
    this.currentId = modelId

    const set = ELEMENT_SETS[modelId]
    if (!set || !this.layer) return

    // Fade out existing
    if (!instant && this.elements.length > 0) {
      this.elements.forEach(el => {
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease'
        el.style.opacity = '0'
        el.style.transform += ' scale(0.8)'
      })
    }

    const populate = () => {
      this.layer.innerHTML = ''
      this.elements = []

      set.forEach(cfg => {
        const wrapper = document.createElement('div')
        wrapper.className = `char-el ${cfg.animClass}`
        wrapper.dataset.side = cfg.side
        wrapper.style.cssText = `
          position: absolute;
          left: ${cfg.left};
          top: ${cfg.top};
          width: ${cfg.width};
          max-width: ${cfg.maxW}px;
          animation-delay: ${cfg.delay};
          transform-origin: center center;
          will-change: transform;
        `
        wrapper.innerHTML = cfg.getSVG()
        this.layer.appendChild(wrapper)
        this.elements.push(wrapper)

        if (!instant) {
          wrapper.style.opacity = '0'
          wrapper.style.transform = 'scale(0.5)'
          setTimeout(() => {
            wrapper.style.transition = 'opacity 0.6s var(--ease-cartoon), transform 0.6s var(--ease-cartoon)'
            wrapper.style.opacity = '0.75'
            wrapper.style.transform = 'scale(1)'
          }, parseFloat(cfg.delay) * 1000 + 80)
        } else {
          wrapper.style.opacity = '0.75'
        }
      })
    }

    if (instant) {
      populate()
    } else {
      setTimeout(populate, 350)
    }
  }

  /** Called from scrollController each frame — opposite direction parallax */
  applyParallax(progress) {
    if (!this.elements.length) return
    const travel = 60 // px total
    this.elements.forEach(el => {
      const dir   = el.dataset.side === 'left' ? 1 : -1
      const shift = dir * progress * travel
      el.style.transform = `translateX(${shift}px)`
    })
  }
}