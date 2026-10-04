import { LinearGradient, type LinearGradientProps } from "expo-linear-gradient";

import { gradientPoints } from "@/shared/utils/gradientPoints";

// Los 135° de los degradados de Lovable que usa la app (`linear-gradient(135deg, …)`):
// de arriba a la izquierda a abajo a la derecha. Calculado una vez. Cuando una
// pantalla necesite otro ángulo (el `gradient-ink` va a 160°), se le añade aquí.
const POINTS = gradientPoints(135);

type DiagonalGradientProps = Omit<LinearGradientProps, "start" | "end">;

/**
 * Un degradado del prototipo a 135°. Único sitio que decide la dirección:
 * lo usan el de marca (`BrandGradient`), la tarjeta de los modales, el color de
 * cada club en la agenda y la tarjeta de la próxima clase. Los colores los pone
 * quien lo usa, del tema.
 */
export function DiagonalGradient(props: DiagonalGradientProps) {
  return <LinearGradient start={POINTS.start} end={POINTS.end} {...props} />;
}
