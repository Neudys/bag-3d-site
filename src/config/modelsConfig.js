/**
 * modelsConfig.js
 * bgColor matches blobColor — main screen same color as reveal dots.
 */
export const modelsConfig = [
  {
    id: 'classic',
    path: '/models/Meshy_AI_bag2_0227192320_texture.glb',
    name: 'Rivière Classic',
    description: 'Timeless silhouette in full-grain calf leather with aged brass hardware.',
    material: 'Full-grain Calfskin',
    origin: 'Florence, Italy',
    // ── CSS background ──────────────────────────────────
    bgColor:     '#6daa6a',   // matches blobColor
    blobColor:   '#6daa6a',
    accentColor: '#2a6a40',
    pillBg:      '#1a3020',
    textDark:    '#ffffff',
    textMuted:   'rgba(255,255,255,0.65)',
    // ── Three.js lights ─────────────────────────────────
    lightColor1:     0xfff8e0,
    lightColor2:     0x80d0a0,
    ambientIntensity: 0.9,
    // ── Model transform ─────────────────────────────────
    modelScale:    3.2,
    modelPosition: [0, -0.4, 0],
    modelRotationY: 0.0
  },
  {
    id: 'rouge',
    path: '/models/Meshy_AI_bag_0227192220_texture.glb',
    name: 'Nocturne Rouge',
    description: 'Structured evening bag in supple box calf with matte gold clasp.',
    material: 'Box Calfskin',
    origin: 'Bordeaux, France',
    bgColor:     '#c94040',   // matches blobColor
    blobColor:   '#c94040',
    accentColor: '#ff8080',
    pillBg:      '#3a0810',
    textDark:    '#ffffff',
    textMuted:   'rgba(255,255,255,0.65)',
    lightColor1:     0xfff0e0,
    lightColor2:     0xf09090,
    ambientIntensity: 0.85,
    modelScale:    3.2,
    modelPosition: [0, -0.3, 0],
    modelRotationY: 0.3
  },
  {
    id: 'rose',
    path: '/models/Meshy_AI_bag4_0227192200_texture.glb',
    name: 'Petal Rose',
    description: 'Architectural tote in soft-grain leather with rose-gold hardware.',
    material: 'Soft-grain Leather',
    origin: 'Paris, France',
    bgColor:     '#d4709a',   // matches blobColor
    blobColor:   '#d4709a',
    accentColor: '#ffb0d0',
    pillBg:      '#3a0828',
    textDark:    '#ffffff',
    textMuted:   'rgba(255,255,255,0.65)',
    lightColor1:     0xfff0f5,
    lightColor2:     0xf0a0c0,
    ambientIntensity: 0.85,
    modelScale:    3.2,
    modelPosition: [0, -0.35, 0],
    modelRotationY: -0.2
  },
  {
    id: 'cobalt',
    path: '/models/Meshy_AI_bag3_0227192211_texture.glb',
    name: 'Abysse Cobalt',
    description: 'Minimalist clutch in patent leather with brushed steel closure.',
    material: 'Patent Leather',
    origin: 'Milan, Italy',
    bgColor:     '#3a70d0',   // matches blobColor
    blobColor:   '#3a70d0',
    accentColor: '#80b0ff',
    pillBg:      '#08183a',
    textDark:    '#ffffff',
    textMuted:   'rgba(255,255,255,0.65)',
    lightColor1:     0xe0f0ff,
    lightColor2:     0xa0c0f0,
    ambientIntensity: 0.80,
    modelScale:    3.2,
    modelPosition: [0, -0.3, 0],
    modelRotationY: 0.15
  }
]