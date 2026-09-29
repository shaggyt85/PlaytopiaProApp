import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { formatWallTime } from "@/shared/utils/formatDate";

import { useStyles } from "./NowLine.styles";

interface NowLineProps {
  /** Desde arriba de la tira, en puntos (`nowOffset`). */
  top: number;
  /** «Ahora» como hora de pared (`wallNow`), para la hora de la pastilla. */
  wallMs: number;
}

/**
 * La línea coral de «ahora» con su hora, que cruza la tira de lado a lado. Oculta
 * al lector de pantalla: las tarjetas ya dicen si una clase está en curso o ya
 * terminó.
 */
export function NowLine({ top, wallMs }: NowLineProps) {
  const styles = useStyles();
  return (
    <View
      style={[styles.row, { top }]}
      pointerEvents="none"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      testID="now-line"
    >
      <View style={styles.pill}>
        <Text variant="badge" color="onPrimary">
          {formatWallTime(wallMs)}
        </Text>
      </View>
      <View style={styles.dot} />
      <View style={styles.line} />
    </View>
  );
}
