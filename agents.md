# MODUBAG — Agent Context & Guidelines

## Project overview

Interactive 3D product showcase for a modular luxury handbag (**MODUBAG**).
Four color variants (Classic, Rouge, Rose, Cobalt), scroll-driven 3D animations, and a
packaging reveal sequence. No framework — vanilla JS with ES6 modules, built with Vite.

**Stack:** Vite · Three.js · GSAP + ScrollTrigger · Lenis (smooth scroll) · Vanilla CSS

---

## Directory map

```
/
├── index.html                        ← Single-page HTML shell
├── vite.config.js                    ← Vite (Three.js + GSAP split chunks)
├── package.json
├── public/models/                    ← GLB model files (DRACO-compressed)
└── src/
    ├── main.js                       ← ENTRY POINT — bootstrap + render loop
    ├── config/
    │   ├── modelsConfig.js           ← Per-variant definitions (colors, paths, lights, transforms)
    │   └── boxAnimationConfig.js     ← 8-keyframe scroll sequences (4 per model)
    ├── core/
    │   ├── scene.js                  ← Transparent Three.js scene
    │   ├── camera.js                 ← PerspectiveCamera FOV 42°, z 15.5
    │   ├── renderer.js               ← WebGL, alpha, ACES tone mapping, max 2× DPR
    │   └── lenis.js                  ← Smooth scroll (2 s duration)
    ├── modules/
    │   ├── animationController.js    ← Loader letters, blob reveal, nav/bar entrance
    │   ├── modelManager.js           ← GLTF/DRACO load, cache, switch, lighting
    │   ├── scrollController.js       ← Scroll-stage rotation + tumble + product-bar hide
    │   ├── interactionController.js  ← Mouse lean/drift (desktop only)
    │   ├── colorTransition.js        ← CSS variable theming per variant
    │   ├── orbitSection.js           ← Feature cards orbit, dome animation, curved text
    │   ├── boxSection.js             ← 3D box geometry + lid/flap pivots
    │   └── boxAnimationSection.js    ← Keyframe interpolation engine
    └── styles/
        ├── base.css                  ← CSS reset + custom properties
        ├── layout.css                ← UI components (nav, bar, orbit, box…)
        ├── animations.css            ← @keyframes
        └── responsive.css           ← Media queries (<480 · <768 · <1024)
```

---

## Boot sequence (`main.js`)

```
1. Loader letters animate in   ┐ parallel
2. Models preload (DRACO GLB)  ┘
3. Blob circles cover screen   → loader hidden, app visible
4. Blob uncovers               → nav + product-bar + 3D model enter
5. Render loop starts (rAF)
6. initOrbitSection()
7. initBoxSection()
8. initBoxAnimationSection()
```

Never re-run `main.js` logic manually — it is a one-shot bootstrap.

---

## Module responsibilities (one rule per module)

| Module | What it owns | What it must NOT touch |
|--------|-------------|----------------------|
| `scrollController` | Bag rotation/tumble during `#scroll-stage`; `#product-bar` hide/show | Camera, model switch |
| `interactionController` | Delta lean/drift on `model.position.x` | `model.rotation`, scroll progress |
| `modelManager` | GLTF load, cache, lights, transitions, current model | CSS variables |
| `colorTransition` | All CSS custom properties (`--bg-color`, `--accent`, etc.) | Three.js scene |
| `orbitSection` | `.orbit-ring` rotation, `.orbit-bg` dome, `.feature-card` visibility | Global scroll |
| `boxSection` | Box mesh, lid/flap pivots via GSAP | Bag model |
| `boxAnimationSection` | Keyframe interpolation during its 700 vh track; disables scroll + interaction controllers | Orbit section |
| `animationController` | Loader, blob reveal, one-time entrance animations | Scroll-driven tweens |

---

## Key HTML identifiers

### Fixed UI
| Selector | Description |
|----------|-------------|
| `#nav` | Fixed top navigation |
| `#product-bar` | Fixed bottom product bar (hides on scroll, reappears at top) |
| `.hid-product-bar` | Scroll marker — when its top hits the viewport bottom the bar hides |
| `#btn-prev` / `#btn-next` | Carousel arrows |
| `#model-dots` | Variant indicator dots |
| `#product-pill-name` | Current model name label |

### Three.js
| Selector | Description |
|----------|-------------|
| `#canvas-container` | Mount point for the WebGL canvas |
| `#env-bg` | Fixed background layer (color driven by CSS vars) |
| `#env-solid` | Solid fill beneath noise overlay |

### Sections (in DOM order)
| Selector | Height | Notes |
|----------|--------|-------|
| `#hero` | 100 vh | Static — bag floats here |
| `#scroll-stage` | 300 vh | Drives bag rotation |
| `.features-scroll-track` | 500 vh | Sticky `#features-orbit` inside |
| `#features-orbit` | sticky | Cards, dome, curved text |
| `.box-scroll-track` | implicit | Box entrance |
| `#box-section` | sticky | 3D box trigger |
| `.box-anim-scroll-track` | 700 vh | Keyframe animation track |
| `#box-animation-in-box` | sticky | Final bag+box sequence |

---

## GSAP + ScrollTrigger rules

1. **Always call `gsap.registerPlugin(ScrollTrigger)`** at the top of any module that
   uses it — even if registered elsewhere.

2. **`scrub` values in use:**
   - Scroll stage: `2.5` (heavy lag = smooth)
   - Orbit section: `1.5`
   - Box animation: `1`

3. **Resize pattern** — all scroll-driven sections kill + rebuild their timeline on
   resize with a 200 ms debounce:
   ```js
   tl.scrollTrigger?.kill()
   tl.kill()
   // reset state
   currentTl = buildTimeline()
   ScrollTrigger.refresh()
   ```

4. **`#product-bar` hide/show** (in `scrollController.js`):
   - `ScrollTrigger.create` with `onEnter` (fires once, downward only) hides the bar.
   - A passive `window.scroll` listener shows it only when `window.scrollY === 0`.
   - Do **not** use `toggleActions` for this — it reverses on scroll-up which is wrong.

5. **`boxAnimationSection` disables others** — it calls
   `scrollController.disable()` and `interactionController.disable()` on enter
   and `enable()` on leave. Respect these gates when adding new controllers.

---

## Model config (`modelsConfig.js`)

Each entry exports:

```js
{
  id, name, path,           // identity + GLB URL
  description, material, origin,
  bgColor, blobColor,       // backdrop
  accentColor, pillBg, textDark, textMuted,  // CSS theme
  lightColor1, lightColor2, ambientIntensity, // Three.js lights
  modelScale,               // uniform scale
  modelPosition: [x, y, z],
  modelRotationY,           // initial Y rotation (radians)
}
```

To add a new variant: add an entry here **and** a matching block in
`boxAnimationConfig.js`. The rest of the app reads the array dynamically.

---

## Box animation keyframes (`boxAnimationConfig.js`)

8 keyframes per model, each keyframe:

```js
{
  progress,          // 0–1 normalised scroll position
  camera: { position, lookAt },
  model:  { position, rotation, scale },
  box:    { position, rotation, lidAngle, flapAngle },  // angles 0–1 normalised
}
```

Interpolation is **linear** between adjacent keyframe pairs.
`lidAngle` / `flapAngle` are mapped to actual mesh pivot angles inside `boxSection.js`.

---

## CSS custom properties (set by `colorTransition.js`)

```
--bg-color       backdrop solid color
--blob-color     blob reveal overlay
--accent-color   highlights, active dots
--pill-bg        nav pill background
--text-dark      primary text
--text-muted     secondary text
```

Never hardcode these colors in JS — always read from the active model config and
let `colorTransition.js` apply them.

---

## Responsive breakpoints

| Breakpoint | Applied in |
|------------|-----------|
| `< 480 px` | `responsive.css` |
| `< 768 px` | `responsive.css` + JS `isMobile` checks |
| `< 1024 px`| `responsive.css` |

JS mobile flag pattern used across modules:
```js
const isMobile = () => window.innerWidth < 768
```

Modules that have mobile-specific values: `scrollController` (descent),
`orbitSection` (dome radius, card radius), `camera.js` (z position).

---

## Performance constraints

- Max pixel ratio: **2×** (hardcoded in `renderer.js`)
- DRACO decompression path: `/draco/` (must be in `public/`)
- Model files are cached in a `Map` inside `modelManager` — never reload a cached model
- Three.js and GSAP are split into separate Vite chunks — do not import them inside
  dynamic `import()` wrappers unless intentional
- `interactionController` is **disabled on mobile** — do not enable it there

---

## Dev globals (available in browser console)

```js
window.__scene     // Three.js Scene
window.__models    // Map of loaded models
window.__switch(id)// Switch to model by id ('classic'|'rouge'|'rose'|'cobalt')
window.__box       // boxSection instance
```

---

## Common mistakes to avoid

| Mistake | Why it breaks |
|---------|--------------|
| Using `toggleActions` for the product-bar scroll hide | Reverses on scroll-up — bar flickers every time the marker is crossed |
| Setting `model.position.x` in scrollController | Owned by interactionController — causes jitter |
| Hardcoding `borderRadius` without mobile variant | Curvature looks wrong on narrow viewports |
| Adding ScrollTrigger without a resize cleanup | Stale triggers after viewport resize |
| Calling `ScrollTrigger.refresh()` before `buildTimeline()` | Triggers fire against old DOM layout |
| Loading a GLB outside `modelManager` | Breaks cache and causes duplicate geometry in memory |
| Animating CSS vars directly with GSAP without `colorTransition.js` | Inconsistent state if model switches simultaneously |
