import { Easing, type WithSpringConfig } from "react-native-reanimated";

/**
 * Tiempos de la animación (ms). Todo tiene que caber en `duration` (3 s):
 * caída 500 + rebotes 1060 + pausa 100 = el texto aparece a los 1,66 s y se
 * ve completo desde los 2,26 s hasta que todo se desvanece a los 3 s.
 */
export const SPLASH_TIMING = {
  duration: 3000,
  fall: 500,
  /** [altura, subida, escala, escalaIn, escalaOut] de cada rebote */
  bounces: [
    [80, 250, 1.3, 80, 200],
    [40, 160, 1.15, 60, 120],
    [15, 120, 1.08, 50, 90],
  ] as const,
  pauseBeforeText: 100,
  textFadeIn: 600,
  fadeOut: 400,
};

/** La curva de todos los pasos: la de `Animated` por defecto, la que tuvo siempre el splash. */
export const SPLASH_EASING = Easing.inOut(Easing.ease);

/**
 * El muelle con que sube el texto. Es el `friction: 6, tension: 80` que
 * tenía con `Animated`, pasado a física con la misma fórmula que React Native
 * (rigidez = (tensión − 30) × 3,62 + 194; amortiguación = (fricción − 8) × 3 + 25).
 */
export const TEXT_SPRING = { stiffness: 375, damping: 19, mass: 1 } satisfies WithSpringConfig;

/** Lo que sube el texto antes de colocarse (px). */
export const TEXT_RISE = 50;

/** Cuánto dura un rebote: lo que más tarda, la subida y la bajada del logo. */
const bounceMs = ([, subida, , escalaIn, escalaOut]: (typeof SPLASH_TIMING.bounces)[number]) =>
  Math.max(2 * subida, escalaIn + escalaOut);

/** Cuándo empieza cada rebote (ms desde el montaje): tras la caída, uno detrás de otro. */
export function bounceStarts(): number[] {
  let start = SPLASH_TIMING.fall;
  return SPLASH_TIMING.bounces.map((bounce) => {
    const at = start;
    start += bounceMs(bounce);
    return at;
  });
}

/** Cuándo empieza a aparecer el texto: tras los rebotes y la pausa. */
export function textStartMs(): number {
  const lastStart = bounceStarts().at(-1) ?? SPLASH_TIMING.fall;
  const lastBounce = SPLASH_TIMING.bounces.at(-1);
  return lastStart + (lastBounce ? bounceMs(lastBounce) : 0) + SPLASH_TIMING.pauseBeforeText;
}
