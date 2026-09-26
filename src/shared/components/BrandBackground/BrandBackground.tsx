import { LinearGradient } from "expo-linear-gradient";
import type { ReactNode } from "react";
import { useWindowDimensions, View, type ViewProps } from "react-native";

import { useTheme } from "@/shared/hooks/useTheme";

import { GLOWS, styles } from "./BrandBackground.styles";

interface BrandBackgroundProps extends ViewProps {
  children?: ReactNode;
}

/** Fondo de marca: el mismo en el splash y en las pantallas de acceso. */
export function BrandBackground({ children, style, ...rest }: BrandBackgroundProps) {
  const theme = useTheme();
  const { height } = useWindowDimensions();

  return (
    <LinearGradient
      colors={theme.gradients.brand}
      locations={[0, 0.5, 1]}
      style={[styles.container, style]}
      {...rest}
    >
      <LinearGradient
        colors={GLOWS.strong}
        locations={GLOWS.locations}
        style={styles.circleTopRight}
      />
      <LinearGradient
        colors={GLOWS.soft}
        locations={GLOWS.locations}
        style={styles.circleBottomLeft}
      />
      <View style={[styles.shimmerTop, { top: height * 0.2 }]} />
      <View style={[styles.shimmerBottom, { bottom: height * 0.3 }]} />
      {children}
    </LinearGradient>
  );
}
