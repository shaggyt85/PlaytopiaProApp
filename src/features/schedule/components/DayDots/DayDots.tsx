import { memo } from "react";
import { View } from "react-native";

import { useStyles } from "./DayDots.styles";

interface DayDotsProps {
  /** Los colores de los clubes del día (`dotsByDate`), hasta tres. */
  colors: readonly string[];
  /** Sobre el degradado del día elegido: blancos. */
  onBrand: boolean;
}

/**
 * Los puntos de un día (`h-1 w-1`), uno por club distinto con clases ese día: en
 * la tira de la semana y en la cuadrícula del mes. El hueco se guarda aunque no
 * haya puntos, así todos los días miden lo mismo.
 */
export const DayDots = memo(function DayDots({ colors, onBrand }: DayDotsProps) {
  const styles = useStyles();
  return (
    <View style={styles.row} testID="day-dots">
      {colors.map((color, index) => (
        <View key={index} style={[styles.dot, onBrand ? styles.onBrand : { backgroundColor: color }]} />
      ))}
    </View>
  );
});
