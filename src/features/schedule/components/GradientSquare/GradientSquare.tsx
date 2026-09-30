import type { ReactNode } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import type { ColorPair } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";

import { useStyles } from "./GradientSquare.styles";

interface GradientSquareProps {
  /** Los colores de su club. */
  colors: ColorPair;
  /** El lado: 56 en Semana, 48 en Mes y en la tarjeta del club. */
  size: number;
  children: ReactNode;
  testID?: string;
}

/**
 * Un cuadrado con el degradado de un club y algo centrado dentro: la hora de
 * una fila (`TimeSquare`) o el punto de la tarjeta del club. El `rounded-2xl`
 * del prototipo no pasa de la mitad del lado: en CSS sale redondo, aquí también.
 */
export function GradientSquare({ colors, size, children, testID }: GradientSquareProps) {
  const styles = useStyles();
  const theme = useTheme();
  const shape = { width: size, height: size, borderRadius: Math.min(theme.radius.xxl, size / 2) };

  return (
    <View style={[styles.square, shape]} testID={testID}>
      <DiagonalGradient colors={colors.gradient} style={styles.fill} />
      {children}
    </View>
  );
}
