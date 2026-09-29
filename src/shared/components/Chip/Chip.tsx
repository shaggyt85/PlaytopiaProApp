import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import { useStyles } from "./Chip.styles";

interface ChipProps {
  /** Texto ya traducido o dato de Core (la sede). Se pinta en mayúsculas. */
  label: string;
}

/**
 * El chip del prototipo (`● INDOOR MAD`): punto y texto sobre el color de marca
 * al 20 %. Lo usan la tarjeta de sede de «Red de clubes» y la pastilla del día
 * de la agenda («● HOY · LUNES 18»).
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
