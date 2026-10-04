import { IconLoCheck } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { AttendanceSummary } from "../../utils/attendanceSummary";

import { CHECK_SIZE, useStyles } from "./AttendanceCount.styles";

interface AttendanceCountProps {
  summary: AttendanceSummary;
}

/**
 * Cómo va la asistencia, a la derecha de «ALUMNOS Y ASISTENCIA»: «2/4
 * presentes» en gris y, cuando todos tienen marca, «✓ Asistencia registrada ·
 * 2/4» en el color de marca.
 */
export function AttendanceCount({ summary }: AttendanceCountProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { present, total, complete } = summary;

  if (!complete) {
    return (
      <Text variant="timeBadge" color="textSecondary" testID="attendance-count">
        {t("schedule.detail.presentCount", { present, total })}
      </Text>
    );
  }
  return (
    <View style={styles.done} testID="attendance-count">
      <IconLoCheck size={CHECK_SIZE} color={theme.colors.primary} />
      <Text variant="timeBadge" color="primary">
        {t("schedule.detail.attendanceDone", { present, total })}
      </Text>
    </View>
  );
}
