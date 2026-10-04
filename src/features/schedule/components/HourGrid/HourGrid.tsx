import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { formatClubTime } from "@/shared/utils/formatDate";

import { MINUTES_PER_HOUR } from "../../utils/classTiming";
import type { HourSpan } from "../../utils/hourSpan";

import { MARKER_HEIGHT, useStyles } from "./HourGrid.styles";

/** El inicio de una clase en la línea: su hora, su color y si es la próxima. */
export interface ClassStart {
  id: number;
  /** `class_time` de Core, `HH:MM:SS`: su etiqueta. */
  time: string;
  /** Su minuto desde las 00:00 (`classMinutes`): dónde va. */
  minutes: number;
  color: string;
  next: boolean;
}

interface HourGridProps {
  span: HourSpan;
  hourHeight: number;
  /** El inicio de cada clase del día: un punto de su color y su hora en la línea. */
  starts: readonly ClassStart[];
}

const hourTime = (hour: number) => `${String(hour).padStart(2, "0")}:00:00`;

/**
 * El eje de la vista Día, como el prototipo: la línea vertical con un puntito
 * en cada hora y su hora a la izquierda («08:00»), y en el minuto en que empieza
 * cada clase, un punto de su color (con brillo si es la próxima) y su hora
 * («07:30»), sin repetir la que ya está. `memo`: el reloj no lo vuelve a pintar.
 * Oculto al lector de pantalla: las tarjetas ya dicen su hora.
 */
export const HourGrid = memo(function HourGrid({ span, hourHeight, starts }: HourGridProps) {
  const styles = useStyles();
  const topOf = (minutes: number) =>
    ((minutes - span.start * MINUTES_PER_HOUR) / MINUTES_PER_HOUR) * hourHeight - MARKER_HEIGHT / 2;

  const hours = Array.from({ length: span.end - span.start + 1 }, (_, i) => span.start + i);
  const hourMinutes = new Set(hours.map((hour) => hour * MINUTES_PER_HOUR));
  // Las horas de las clases que no caen en punto, una vez cada una.
  const extraLabels = [...new Map(starts.map((s) => [s.minutes, s.time])).entries()].filter(
    ([minutes]) => !hourMinutes.has(minutes),
  );

  return (
    <View style={styles.fill} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
      <View style={styles.line} />
      {hours.map((hour) => (
        <View key={hour} style={[styles.marker, { top: topOf(hour * MINUTES_PER_HOUR) }]} testID={`hour-${hour}`}>
          <Text variant="chip" color="textSecondary" style={styles.label}>
            {formatClubTime(hourTime(hour))}
          </Text>
          <View style={styles.hourDot} />
        </View>
      ))}
      {extraLabels.map(([minutes, time]) => (
        <View key={minutes} style={[styles.marker, { top: topOf(minutes) }]} testID={`start-label-${minutes}`}>
          <Text variant="chip" color="textSecondary" style={styles.label}>
            {formatClubTime(time)}
          </Text>
        </View>
      ))}
      {starts.map((start) => (
        <View key={start.id} style={[styles.marker, { top: topOf(start.minutes) }]} testID={`start-dot-${start.id}`}>
          <View style={[styles.classDot, { backgroundColor: start.color }, start.next && styles.nextDot]} />
        </View>
      ))}
    </View>
  );
});
