import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import { useStyles } from "./Chip.styles";

interface ChipProps {
  /** Texto ya traducido o dato de Core (la sede). Se pinta en mayúsculas. */
  label: string;
  /** El punto delante (por defecto, sí). Sin él, la pastilla «HOY · 23:10» de la semana. */
  dot?: boolean;
}

/**
 * El chip del prototipo (`● INDOOR MAD`): punto y texto sobre el color de marca
 * al 20 %. Lo usan la tarjeta de sede de «Red de clubes», la pastilla del día
 * de la agenda («● HOY · LUNES 18») y, sin punto, la de hoy en la semana.
 */
export function Chip({ label, dot = true }: ChipProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      {dot ? <View style={styles.dot} testID="chip-dot" /> : null}
      <Text variant="chip" color="primary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
