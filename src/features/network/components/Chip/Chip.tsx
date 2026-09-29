import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import { useStyles } from "./Chip.styles";

interface ChipProps {
  /** Texto ya traducido o dato de Core (la sede). Se pinta en mayúsculas. */
  label: string;
}

/**
 * El chip de las tarjetas del prototipo (`● INDOOR MAD`): punto y texto sobre
 * el color de marca al 20 %. Lo usará también la bolsa de trabajo; se queda en
 * la feature hasta que otra lo necesite.
 */
export function Chip({ label }: ChipProps) {
  const styles = useStyles();
  return (
    <View style={styles.container}>
      <View style={styles.dot} />
      <Text variant="chip" color="primary" numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
