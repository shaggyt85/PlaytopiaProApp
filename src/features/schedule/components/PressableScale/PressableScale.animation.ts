import { Easing, type WithTimingConfig } from "react-native-reanimated";

/**
 * Cómo se encoge lo que se toca (el `active:scale-[0.98] transition` del
 * prototipo). Todos los valores aquí: ajustar cómo se siente no obliga a tocar
 * el componente.
 */
export const PRESS_ANIMATION = {
  /** Cuánto se encoge al pulsar. */
  pressedScale: 0.98,
  timing: { duration: 120, easing: Easing.out(Easing.quad) } satisfies WithTimingConfig,
} as const;
