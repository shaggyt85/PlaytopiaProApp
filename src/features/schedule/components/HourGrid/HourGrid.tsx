import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { formatClubTime } from "@/shared/utils/formatDate";

import type { HourSpan } from "../../utils/hourSpan";

import { useStyles } from "./HourGrid.styles";

interface HourGridProps {
  span: HourSpan;
  hourHeight: number;
}

const hourTime = (hour: number) => `${String(hour).padStart(2, "0")}:00:00`;

/**
 * Las horas de la franja con su línea fina. `memo`: la hora que avanza cada
 * minuto no la vuelve a pintar, solo cambia si cambia la franja. Oculta al
 * lector de pantalla: las tarjetas ya dicen su hora.
 */
export const HourGrid = memo(function HourGrid({ span, hourHeight }: HourGridProps) {
  const styles = useStyles();
  const hours = Array.from({ length: span.end - span.start + 1 }, (_, i) => span.start + i);

  return (
    <View style={styles.fill} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      {hours.map((hour, i) => (
        <View key={hour} style={[styles.row, { top: i * hourHeight }]} testID={`hour-${hour}`}>
          <Text variant="chip" color="textSecondary" style={styles.label}>
            {formatClubTime(hourTime(hour))}
          </Text>
          <View style={styles.line} />
        </View>
      ))}
    </View>
  );
});
