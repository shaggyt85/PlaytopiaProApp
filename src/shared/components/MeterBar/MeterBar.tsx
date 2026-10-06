import { View } from "react-native";

import { DiagonalGradient } from "@/shared/components/DiagonalGradient";
import type { ColorPair } from "@/shared/config/theme";

import { useStyles, type MeterSize } from "./MeterBar.styles";

interface MeterBarProps {
  /** Lo lleno, de 0 a 1; lo que se sale se recorta. */
  value: number;
  /** El degradado del relleno: el de su clase, el de marca… */
  colors: ColorPair["gradient"];
  /** `sm` (por defecto) o `md`: ver `METER_HEIGHTS`. */
  size?: MeterSize;
  /** Del relleno: su ancho es lo que se comprueba. */
  testID?: string;
}

/**
 * La barra fina del prototipo: el carril gris y el relleno en degradado hasta
 * su proporción. Único sitio que la dibuja: la ocupación de una clase en la
 * Semana y las horas de cada club y de cada mes en Perfil. Es decorativa: lo
 * que mide lo dice el texto de al lado.
 */
export function MeterBar({ value, colors, size = "sm", testID }: MeterBarProps) {
  const styles = useStyles();
  const filled = Math.min(1, Math.max(0, value));
  return (
    <View style={[styles.track, styles[size]]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <View style={[styles.fill, { width: `${filled * 100}%` }]} testID={testID}>
        <DiagonalGradient colors={colors} style={styles.gradient} />
      </View>
    </View>
  );
}
