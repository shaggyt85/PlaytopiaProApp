import type { LinearGradientProps } from "expo-linear-gradient";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { useTheme } from "@/shared/hooks/useTheme";

interface BrandGradientProps extends Omit<LinearGradientProps, "colors" | "start" | "end"> {
  /** Gris, para lo que no se puede pulsar. */
  inactive?: boolean;
}

/**
 * El degradado de marca: botón principal, gota del menú y pestaña activa. Único
 * sitio que decide sus colores; el ángulo es el de `DiagonalGradient`.
 */
export function BrandGradient({ inactive = false, ...rest }: BrandGradientProps) {
  const theme = useTheme();
  return <DiagonalGradient colors={inactive ? theme.gradients.disabled : theme.gradients.brand} {...rest} />;
}
