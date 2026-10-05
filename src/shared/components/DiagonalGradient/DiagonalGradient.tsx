import { LinearGradient, type LinearGradientProps } from "expo-linear-gradient";

import { gradientPoints } from "@/shared/utils/gradientPoints";

// Los ángulos de los degradados de Lovable que usa la app (`linear-gradient(135deg, …)`),
// calculados una vez: 135° (de arriba a la izquierda a abajo a la derecha), el
// de casi todos, y 160°, el del `gradient-ink`. Cuando una pantalla necesite otro
// ángulo, se le añade aquí.
const POINTS = {
  135: gradientPoints(135),
  160: gradientPoints(160),
} as const;

type DiagonalGradientProps = Omit<LinearGradientProps, "start" | "end"> & {
  /** 135° por defecto. */
  angle?: keyof typeof POINTS;
};

/**
 * Un degradado del prototipo en diagonal. Único sitio que decide la dirección:
 * lo usan el de marca (`BrandGradient`), la tarjeta de los modales, el color de
 * cada club en la agenda, la tarjeta de la próxima clase y, a 160°, «Su grupo»
 * en la ficha de un alumno. Los colores los pone quien lo usa, del tema.
 */
export function DiagonalGradient({ angle = 135, ...props }: DiagonalGradientProps) {
  const { start, end } = POINTS[angle];
  return <LinearGradient start={start} end={end} {...props} />;
}
