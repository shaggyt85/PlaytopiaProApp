import type { ReactNode } from "react";
import { useWindowDimensions, View, type ViewProps } from "react-native";
import Svg, { Defs, RadialGradient, Rect, Stop } from "react-native-svg";

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

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }, style]} {...rest}>
      <Svg style={styles.backdrop} width={width} height={height} pointerEvents="none">
        <Defs>
          {theme.backdrop.map((glow, index) => {
            const cx = glow.x * width;
            const cy = glow.y * height;
            // Distancia a la esquina más lejana: el tamaño por defecto en CSS.
            const r = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));
            return (
              <RadialGradient
                key={glow.color}
                id={`backdrop-${index}`}
                cx={cx}
                cy={cy}
                r={r}
                gradientUnits="userSpaceOnUse"
              >
                <Stop offset="0" stopColor={glow.color} stopOpacity={glow.opacity} />
                <Stop offset={glow.reach} stopColor={glow.color} stopOpacity={0} />
              </RadialGradient>
            );
          })}
        </Defs>
        {theme.backdrop.map((glow, index) => (
          <Rect key={glow.color} width={width} height={height} fill={`url(#backdrop-${index})`} />
        ))}
      </Svg>
      {children}
    </View>
  );
}
