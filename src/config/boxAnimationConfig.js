/**
 * boxAnimationConfig.js
 *
 * ── CÓMO EDITAR ──────────────────────────────────────────────────────────
 *  Cada modelo tiene su propia entrada en `models`.
 *  La clave debe coincidir con modelsConfig[n].id → 'classic' 'rouge' 'rose' 'cobalt'
 *  Si el modelo activo no tiene entrada propia, se usa 'default'.
 *
 *  Cada columna = un keyframe. El sistema hace el lerp entre columnas solo.
 *
 *        KF0    KF1    KF2  ...
 *  progress: [0.0,  0.14,  0.29, ...]
 *
 *  camera.position / camera.lookAt  →  [ [x,y,z], [x,y,z], ... ]
 *  model.position  / model.rotation →  [ [x,y,z], [x,y,z], ... ]  (rotation en radianes)
 *  model.scale                      →  [ 1.0, 1.5, 2.0, ... ]      (escala uniforme — opcional)
 *  box.position    / box.rotation   →  [ [x,y,z], [x,y,z], ... ]
 *  box.lidAngle  / box.flapAngle    →  [ 0, 1, 0, ... ]  (0=cerrada 1=abierta)
 *
 * ── REFERENCIA ───────────────────────────────────────────────────────────
 *  Cámara reposo  : position [0, 0.3, 15.5]  lookAt [0, 0, 0]
 *  Bolsa fin scroll-stage: position [0, -5.0, 0]
 *  Caja visible   : position [0, -5.0, 0]
 *  Caja oculta    : position [0, -23,  0]
 *  Math.PI = 180°  /  Math.PI*2 = 360°
 */

export const boxAnimationConfig = {

  scrollHeight: '700vh',

  models: {

    // ── DEFAULT / classic — rota a la DERECHA 180° ──────────────────────────
    default: {
      //          KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
      progress: [ 0.0,  0.14, 0.29, 0.43, 0.57, 0.71, 0.86, 1.0],

      camera: {
        position: [
          [0,   0,   15.5],  // KF0 — posición inicial
          [0,   4,   13.5],  // KF1
          [0,   8,   11.5],  // KF2 — sube mientras caja sube
          [0,   9,   11.0],  // KF3 — caja abierta
          [0,   9,   11.0],  // KF4
          [0,   7,   12.0],  // KF5
          [0,   4,   13.5],  // KF6
          [0,   0,   15.5],  // KF7 — vuelve al inicio
        ],
        lookAt: [
          [0,   0,  0],      // KF0
          [0,  -1,  0],      // KF1
          [0,  -2,  0],      // KF2
          [0,  -2,  0],      // KF3
          [0,  -2,  0],      // KF4
          [0,  -1,  0],      // KF5
          [0,   0,  0],      // KF6
          [0,   0,  0],      // KF7
        ],
      },

      model: {
        position: [
          [0, -5.0,  0],    // KF0
          [0, -5.0,  0],    // KF1 — sube la caja, bolsa queda abajo
          [0, -5.0,  0],    // KF2
          [0, -5.0,  0],    // KF3 — caja abierta alrededor de la bolsa
          [0, -5.0, 0],     // KF4
          [0, -8.0, 0],     // KF5 — empieza a bajar
          [0, -23.0, 0],    // KF6
          [0, -33.0, 0],    // KF7
        ],
        rotation: [
          [0,  0,              0],  // KF0 — sin rotación
          [0,  Math.PI * 0.25, 0],  // KF2 —  45° derecha
          [0,  Math.PI * 0.5,  0],  // KF3 —  90° derecha
          [0,  Math.PI * 0.75, 0],  // KF4 — 135° derecha
          [0,  Math.PI * 0.75, 0],
          [0,  Math.PI * 0.75, 0],
          [0,  Math.PI * 0.75, 0],
          [0,  Math.PI * 0.75, 0],
        ],
        //        KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
        scale: [  3.2,  3.2,  3.2,  2.9,  2.9,  2.9,  2.9,  2.9 ],
      },

      box: {
        position: [
          [0, -33.0, 0],     // KF0 — oculta abajo
          [0, -23.0, 0],     // KF1 — empieza a subir
          [0,  -8.0, 0],     // KF2 — casi arriba
          [0,  -5.0, 0],     // KF3 — centrada en la bolsa
          [0,  -5.0, 0],     // KF4
          [0,  -8.0, 0],     // KF5 — empieza a bajar
          [0, -23.0, 0],     // KF6
          [0, -33.0, 0],     // KF7 — oculta abajo
        ],
        rotation: [
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
        ],
        //          KF0  KF1  KF2  KF3  KF4  KF5  KF6  KF7
        lidAngle:  [ 1, 1, 1, 1, 0, 0, 0, 0 ],   // ← nuevo
        flapAngle: [ 1, 1, 1, 1, 0, 0, 0, 0 ],
      },
    },

    // ── ROUGE — rota a la IZQUIERDA 180° ────────────────────────────────────
    rouge: {
      //         KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
      progress: [0.0,  0.14, 0.29, 0.43, 0.57, 0.71, 0.86, 1.0],

      camera: {
        position: [
          [0,   0,   15.5],
          [-1,  4,   13.5],  // KF1 — ligero desplazamiento izquierda
          [-1,  8,   11.5],
          [-1,  9,   11.0],
          [-1,  9,   11.0],
          [-1,  7,   12.0],
          [-1,  4,   13.5],
          [0,   0,   15.5],
        ],
        lookAt: [
          [0,   0,  0],
          [-0.5, -1, 0],
          [-0.5, -2, 0],
          [-0.5, -2, 0],
          [-0.5, -2, 0],
          [-0.5, -1, 0],
          [0,    0,  0],
          [0,    0,  0],
        ],
      },

      model: {
        position: [
          [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0],
          [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0],
        ],
        rotation: [
          [0,  0,               0],  // KF0
          [0,  0,               0],  // KF1
          [0, -Math.PI * 0.25,  0],  // KF2 —  45° IZQUIERDA
          [0, -Math.PI * 0.5,   0],  // KF3 —  90° izquierda
          [0, -Math.PI * 0.75,  0],  // KF4 — 135° izquierda
          [0, -Math.PI,         0],  // KF5 — 180° izquierda
          [0, -Math.PI,         0],  // KF6
          [0, -Math.PI,         0],  // KF7
        ],
        //        KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
        scale: [  3.2,  3.2,  3.2,  3.2,  3.2,  3.2,  3.2,  3.2 ],
      },

      box: {
        position: [
          [0, -33.0, 0], [0, -23.0, 0], [0,  -8.0, 0], [0, -5.0, 0],
          [0,  -5.0, 0], [0,  -8.0, 0], [0, -23.0, 0], [0, -33.0, 0],
        ],
        rotation: [
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
        ],
        //          KF0  KF1  KF2  KF3  KF4  KF5  KF6  KF7
        lidAngle:  [ 1, 1, 1, 1, 0, 0, 0, 0 ],   // ← nuevo
        flapAngle: [ 1, 1, 1, 1, 0, 0, 0, 0 ],
      },
    },

    // ── ROSE — SIN ROTACIÓN, solo sube y baja ───────────────────────────────
    rose: {
      //         KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
      progress: [0.0,  0.14, 0.29, 0.43, 0.57, 0.71, 0.86, 1.0],

      camera: {
        position: [
          [0,   0,   15.5],
          [0,   3,   14.0],  // KF1 — sube más despacio (cámara más lenta)
          [0,   6,   13.0],
          [0,   7,   12.5],
          [0,   7,   12.5],
          [0,   6,   13.0],
          [0,   3,   14.0],
          [0,   0,   15.5],
        ],
        lookAt: [
          [0,  0,  0],
          [0, -0.5, 0],
          [0, -1.5, 0],
          [0, -1.5, 0],
          [0, -1.5, 0],
          [0, -0.5, 0],
          [0,  0,   0],
          [0,  0,   0],
        ],
      },

      model: {
        position: [
          [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0],
          [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0],
        ],
        rotation: [
        
          [0, 0, 0],               // KF0 → 0°
          [-Math.PI / 6, 0, 0],     // KF1 → 30°
          [-Math.PI / 3, 0, 0],     // KF2 → 60°
          [-Math.PI / 2, 0, 0],     // KF3 → 90°
          [-Math.PI / 2, 0, 0],     // KF4
          [-Math.PI / 2, 0, 0],     // KF5
          [-Math.PI / 2, 0, 0],     // KF6
          [-Math.PI / 2, 0, 0],     // KF7
            // KF7
        ],
        //        KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
        scale: [  3.2,  3.2,  3.2,  3.2,  2.9,  2.9,  2.9,  2.9 ],
      },

      box: {
        position: [
          [0, -33.0, 0], [0, -23.0, 0], [0,  -8.0, 0], [0, -5.0, 0],
          [0,  -5.0, 0], [0,  -8.0, 0], [0, -23.0, 0], [0, -33.0, 0],
        ],
        rotation: [
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
        ],
        //          KF0  KF1  KF2  KF3  KF4  KF5  KF6  KF7
        lidAngle:  [ 1, 1, 1, 1, 0, 0, 0, 0 ],   // ← nuevo
        flapAngle: [ 1, 1, 1, 1, 0, 0, 0, 0 ],
      },
    },

    // ── COBALT — 360° completo ───────────────────────────────────────────────
    cobalt: {
      //         KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
      progress: [0.0,  0.14, 0.29, 0.43, 0.57, 0.71, 0.86, 1.0],

      camera: {
        position: [
          [0,   0,   15.5],
          [0,   5,   13.0],
          [0,   9,   11.0],
          [0,  11,   10.5],  // KF3 — más cerca para ver el 360
          [0,  11,   10.5],
          [0,   9,   11.0],
          [0,   5,   13.0],
          [0,   0,   15.5],
        ],
        lookAt: [
          [0,  0,  0],
          [0, -1,  0],
          [0, -2,  0],
          [0, -2,  0],
          [0, -2,  0],
          [0, -1,  0],
          [0,  0,  0],
          [0,  0,  0],
        ],
      },

      model: {
        position: [
          [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0],
          [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0], [0, -5.0, 0],
        ],
        rotation: [
          [0,  0,               0],  // KF0 —   0°
          [0,  Math.PI * 0.5,  0],  // KF1 —  90°
          [0,  Math.PI,        0],  // KF2 — 180°
          [0,  Math.PI * 1.5,  0],  // KF3 — 270°
          [0,  Math.PI * 2,    0],  // KF4 — 360° completo
          [0,  Math.PI * 2,    0],  // KF5
          [0,  Math.PI * 2,    0],  // KF6
          [0,  Math.PI * 2,    0],  // KF7
        ],
        //        KF0   KF1   KF2   KF3   KF4   KF5   KF6   KF7
        scale: [  3.2,  3.2,  3.2,  3.2,  3.2,  3.2,  3.2,  3.2 ],
      },

      box: {
        position: [
          [0, -33.0, 0], [0, -23.0, 0], [0,  -8.0, 0], [0, -5.0, 0],
          [0,  -5.0, 0], [0,  -8.0, 0], [0, -23.0, 0], [0, -33.0, 0],
        ],
        rotation: [
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
          [0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0],
        ],
        //          KF0  KF1  KF2  KF3  KF4  KF5  KF6  KF7
        lidAngle:  [ 1, 1, 1, 1, 0, 0, 0, 0 ],   // ← nuevo
        flapAngle: [ 1, 1, 1, 1, 0, 0, 0, 0 ],
      },
    },

  },
}
