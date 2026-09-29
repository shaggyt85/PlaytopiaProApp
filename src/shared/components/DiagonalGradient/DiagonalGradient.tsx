import { LinearGradient, type LinearGradientProps } from "expo-linear-gradient";

import { gradientPoints } from "@/shared/utils/gradientPoints";

// Los 135° de casi todos los degradados de Lovable (`linear-gradient(135deg, …)`):
// de arriba a la izquierda a abajo a la derecha. Calculado una vez.
const DEFAULT_ANGLE = 135;
const DEFAULT_POINTS = gradientPoints(DEFAULT_ANGLE);

interface DiagonalGradientProps extends Omit<LinearGradientProps, "start" | "end"> {
  /** El ángulo de CSS del prototipo; 135° si no se dice (`gradient-ink` va a 160°). */
  angle?: number;
}

/**
 * Un degradado del prototipo en su ángulo. Único sitio que decide la dirección:
 * lo usan el de marca (`BrandGradient`), la tarjeta de los modales, el color de
 * cada club en la agenda y la tarjeta de la próxima clase. Los colores los pone
 * quien lo usa, del tema.
 */
export function DiagonalGradient({ angle = DEFAULT_ANGLE, ...props }: DiagonalGradientProps) {
  const { start, end } = angle === DEFAULT_ANGLE ? DEFAULT_POINTS : gradientPoints(angle);
  return <LinearGradient start={start} end={end} {...props} />;
}
