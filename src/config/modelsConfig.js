/**
 * modelsConfig.js
 * Central configuration for all 3D models.
 * Add new models here — no other file needs to change.
 */

export const modelsConfig = [
  {
    id: 'classic',
    path: '/models/Meshy_AI_bag_0227192220_texture.glb',
    name: 'Rivière Classic',
    description: 'Timeless silhouette in full-grain calf leather with aged brass hardware.',
    material: 'Full-grain Calfskin',
    origin: 'Florence, Italy',
    // Environment palette
    bgGradient: 'radial-gradient(ellipse at 60% 40%, #7a5c38 0%, #2e1e0f 60%, #0d0804 100%)',
    accentColor: '#c8960a',
    textLight: '#f5e6c8',
    particleColor: 0xc89632,
    lightColor1: 0xffe0a0,
    lightColor2: 0x8b5e20,
    ambientIntensity: 0.55,
    modelScale: 3.2,
    modelPosition: [0, -0.4, 0],
    modelRotationY: 0.0
  },
  {
    id: 'burgundy',
    path: '/models/Meshy_AI_bag2_0227192320_texture.glb',
    name: 'Nocturne II',
    description: 'Structured evening bag in supple box calf with matte gold clasp.',
    material: 'Box Calfskin',
    origin: 'Bordeaux, France',
    bgGradient: 'radial-gradient(ellipse at 40% 50%, #5c1520 0%, #1e0508 60%, #080203 100%)',
    accentColor: '#b07a8a',
    textLight: '#f5d8dd',
    particleColor: 0xb07a8a,
    lightColor1: 0xffb0b8,
    lightColor2: 0x6b1020,
    ambientIntensity: 0.5,
    modelScale: 3.2,
    modelPosition: [0, -0.3, 0],
    modelRotationY: 0.3
  },
  {
    id: 'forest',
    path: '/models/Meshy_AI_bag3_0227192211_texture.glb',
    name: 'Verdant',
    description: 'Architectural tote in vegetable-tanned leather with oxidized copper hardware.',
    material: 'Veg-tanned Leather',
    origin: 'Córdoba, Spain',
    bgGradient: 'radial-gradient(ellipse at 50% 45%, #1a3d20 0%, #0a1a0d 60%, #030807 100%)',
    accentColor: '#6baa70',
    textLight: '#d8f0da',
    particleColor: 0x4a8a50,
    lightColor1: 0xa0e0a8,
    lightColor2: 0x1a5a22,
    ambientIntensity: 0.5,
    modelScale: 3.2,
    modelPosition: [0, -0.35, 0],
    modelRotationY: -0.2
  },
  {
    id: 'midnight',
    path: '/models/Meshy_AI_bag4_0227192200_texture.glb',
    name: 'Abysse',
    description: 'Minimalist clutch in patent leather with architectural brushed steel closure.',
    material: 'Patent Leather',
    origin: 'Milan, Italy',
    bgGradient: 'radial-gradient(ellipse at 55% 40%, #0d1e3e 0%, #050d1a 60%, #020408 100%)',
    accentColor: '#5a8adf',
    textLight: '#d0e4ff',
    particleColor: 0x4070c0,
    lightColor1: 0x8ab0ff,
    lightColor2: 0x0d2060,
    ambientIntensity: 0.45,
    modelScale: 3.2,
    modelPosition: [0, -0.3, 0],
    modelRotationY: 0.15
  }
]
