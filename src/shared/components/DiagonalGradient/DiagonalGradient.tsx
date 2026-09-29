import { LinearGradient, type LinearGradientProps } from "expo-linear-gradient";

// Los 135° de los degradados de Lovable (`linear-gradient(135deg, …)`): de
// arriba a la izquierda a abajo a la derecha.
const START = { x: 0, y: 0 } as const;
const END = { x: 1, y: 1 } as const;

type DiagonalGradientProps = Omit<LinearGradientProps, "start" | "end">;

/**
 * Un degradado del prototipo en su ángulo. Único sitio que decide la dirección:
 * lo usan el de marca (`BrandGradient`), la tarjeta de los modales y el color de
 * cada club en la agenda. Los colores los pone quien lo usa, del tema.
 */
export function DiagonalGradient(props: DiagonalGradientProps) {
  return <LinearGradient start={START} end={END} {...props} />;
}
