import type { WithSpringConfig } from "react-native-reanimated";

/**
 * Cómo se mueve la gota de la pestaña activa. Todos los valores aquí: ajustar
 * cómo se siente no obliga a tocar el componente.
 *
 * 1. Anticipación: retrocede un poco hacia el lado contrario y crece.
 * 2. Muelle: salta hasta la pestaña nueva, con algo de rebote.
 * 3. Estela: una copia translúcida sale de donde estaba y llega con retraso.
 * 4. Brillo: una capa de brillo aparece al llegar y se apaga.
 */
export const DROP_ANIMATION = {
  anticipationMs: 120,
  /** Cuánto retrocede antes de saltar (px). */
  recoil: 12,
  /** Cuánto crece durante la anticipación. */
  anticipationScale: 1.06,
  spring: { stiffness: 140, damping: 14, mass: 1 } satisfies WithSpringConfig,
  scaleSpring: { stiffness: 160, damping: 10, mass: 1 } satisfies WithSpringConfig,
  trailDelayMs: 60,
  trailSpring: { stiffness: 110, damping: 16, mass: 1.4 } satisfies WithSpringConfig,
  trailOpacity: 0.5,
  glowInMs: 150,
  glowHoldMs: 250,
  glowOutMs: 300,
} as const;

/** Desplazamiento de la gota para la pestaña `index` (el ancho de cada una es igual). */
export const indicatorOffset = (index: number, tabWidth: number): number =>
  Math.max(0, index) * tabWidth;

/** Punto de retroceso de la anticipación, sin salirse de la barra. */
export const recoilTarget = (from: number, to: number, maxOffset: number): number =>
  Math.min(maxOffset, Math.max(0, from - Math.sign(to - from) * DROP_ANIMATION.recoil));
