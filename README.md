# MODUBAG — 3D Interactive Luxury Collection Site

Built with **Vite + Three.js + GSAP** following a professional modular architecture.

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

## Project Structure

```
├── index.html
├── vite.config.js
├── package.json
│
└── src/
    ├── main.js                   ← Entry point (composition only)
    │
    ├── core/
    │   ├── scene.js              ← THREE.Scene
    │   ├── camera.js             ← PerspectiveCamera + responsive
    │   └── renderer.js           ← WebGLRenderer
    │
    ├── modules/
    │   ├── modelManager.js       ← GLB loading, caching, GSAP transitions
    │   ├── animationController.js← Loader, hero reveal, UI text animations
    │   ├── scrollController.js   ← GSAP ScrollTrigger scroll-driven rotation
    │   ├── interactionController.js ← Mouse tilt interpolation
    │   └── colorTransition.js    ← Background & accent color switching
    │
    ├── config/
    │   └── modelsConfig.js       ← All model data (add models here)
    │
    └── styles/
        ├── base.css              ← Reset + CSS variables
        ├── layout.css            ← All components
        ├── animations.css        ← Keyframes
        └── responsive.css        ← Media queries

public/
└── models/                       ← Your .glb files live here
```

## Adding a New Model

Edit `src/config/modelsConfig.js` and add an entry:

```js
{
  id: 'newbag',
  path: '/models/your-model.glb',
  name: 'Your Bag Name',
  description: '...',
  material: '...',
  origin: '...',
  bgGradient: 'radial-gradient(...)',
  accentColor: '#hexcolor',
  ...
}
```

Drop the `.glb` file into `public/models/`. No other files need to change.

## Controls

| Input          | Action            |
|---------------|-------------------|
| Arrow buttons | Switch model      |
| ← → keyboard  | Switch model      |
| Scroll        | Rotate & descend  |
| Mouse move    | Tilt model        |

## Deploy to Vercel

```bash
npm run build
vercel deploy dist/
```
