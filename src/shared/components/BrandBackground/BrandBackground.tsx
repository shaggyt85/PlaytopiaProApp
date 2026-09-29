import type { ReactNode } from "react";
import { useWindowDimensions, View, type ViewProps } from "react-native";

import { RadialGlow } from "@/shared/components/RadialGlow";
import { useTheme } from "@/shared/hooks/useTheme";

import { styles } from "./BrandBackground.styles";

interface BrandBackgroundProps extends ViewProps {
  children?: ReactNode;
}

/**
 * Fondo de marca (splash, acceso y app): el color de fondo con los tres
 * resplandores radiales de `theme.backdrop`. Cada uno llega hasta la esquina
 * más lejana de su centro, como `radial-gradient(circle at …)` en CSS.
 */
export function BrandBackground({ children, style, ...rest }: BrandBackgroundProps) {
  const theme = useTheme();
  const { width, height } = useWindowDimensions();

  const glows = theme.backdrop.map((glow) => {
    const cx = glow.x * width;
    const cy = glow.y * height;
    // Distancia a la esquina más lejana: el tamaño por defecto en CSS.
    const r = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));
    return { color: glow.color, opacity: glow.opacity, cx, cy, r, reach: glow.reach };
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]} {...rest}>
      <RadialGlow width={width} height={height} glows={glows} />
      {children}
    </View>
  );
}
