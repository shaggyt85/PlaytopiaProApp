import { LinearGradient, type LinearGradientProps } from "expo-linear-gradient";

import { useTheme } from "@/shared/hooks/useTheme";

// Los 135° del `gradient-brand` de Lovable: de arriba a la izquierda a abajo a la derecha.
const START = { x: 0, y: 0 } as const;
const END = { x: 1, y: 1 } as const;

interface BrandGradientProps extends Omit<LinearGradientProps, "colors" | "start" | "end"> {
  /** Gris, para lo que no se puede pulsar. */
  inactive?: boolean;
}

/**
 * El degradado de marca en su ángulo: botón principal, gota del menú y
 * pestaña activa. Único sitio que decide sus colores y su dirección.
 */
export function BrandGradient({ inactive = false, ...rest }: BrandGradientProps) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={inactive ? theme.gradients.disabled : theme.gradients.brand}
      start={START}
      end={END}
      {...rest}
    />
  );
}
