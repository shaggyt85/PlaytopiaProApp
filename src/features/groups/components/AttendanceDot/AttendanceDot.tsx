import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { ATTENDANCE_ICON } from "@/shared/config/icons";
import { useTheme } from "@/shared/hooks/useTheme";
import { formatDayMonthNumeric } from "@/shared/utils/formatDate";

import type { AttendanceEntry } from "../../schemas/groupAttendance.schema";

import { DOT_ICON_SIZE, markColor, useStyles } from "./AttendanceDot.styles";

/**
 * Una clase del historial de un alumno, como el prototipo: el círculo con ✓ si
 * vino o ✗ si faltó, en su color, y su fecha corta debajo («28/9»). Solo se
 * ve: la fila entera se lee de una vez (`AttendanceHistoryCard`).
 */
export function AttendanceDot({ entry }: { entry: AttendanceEntry }) {
  const styles = useStyles();
  const theme = useTheme();
  const Icon = ATTENDANCE_ICON[entry.status];

  return (
    <View style={styles.column}>
      <View style={[styles.dot, styles[entry.status]]} testID={`attendance-dot-${entry.status}`}>
        <Icon size={DOT_ICON_SIZE} color={markColor(theme, entry.status)} />
      </View>
      <Text variant="meta" color="textSecondary">
        {formatDayMonthNumeric(entry.class_date)}
      </Text>
    </View>
  );
}
