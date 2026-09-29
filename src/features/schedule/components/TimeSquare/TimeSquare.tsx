import { memo } from "react";
import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import { Text } from "@/shared/components/Text";
import type { ColorPair } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatClubTime } from "@/shared/utils/formatDate";

import { useStyles } from "./TimeSquare.styles";

interface TimeSquareProps {
  /** `class_time` de Core ("08:30:00"). */
  time: string;
  /** Los colores de su club. */
  colors: ColorPair;
  /** El lado: 56 en Semana (`h-14 w-14`) y 48 en Mes (`h-12 w-12`). */
  size: number;
}

/**
 * La hora de una clase en su cuadrado con el degradado del club, delante de su
 * fila en Semana y en Mes. El `rounded-2xl` del prototipo es mayor que la mitad
 * del lado, así que en CSS sale redondo: aquí también.
 */
export const TimeSquare = memo(function TimeSquare({ time, colors, size }: TimeSquareProps) {
  const styles = useStyles();
  const theme = useTheme();
  // `rounded-2xl`: el radio del prototipo, que no pasa de la mitad del lado.
  const shape = { width: size, height: size, borderRadius: Math.min(theme.radius.xxl, size / 2) };

  return (
    <View style={[styles.square, shape]} testID="time-square">
      <DiagonalGradient colors={colors.gradient} style={styles.fill} />
      <Text variant="timeBadge" color="onPrimary">
        {formatClubTime(time)}
      </Text>
    </View>
  );
});
