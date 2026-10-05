import { View } from "react-native";

import { BottomSheet } from "@/shared/components/BottomSheet";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { capitalize, formatWeekdayShortDayMonth } from "@/shared/utils/formatDate";
import { joinParts } from "@/shared/utils/joinParts";

import type { AttendanceStatus, ClassStudent, ScheduleClass } from "../../schemas/schedule.schema";
import { attendanceSummary } from "../../utils/attendanceSummary";
import type { AttendanceState } from "../../utils/attendanceWindow";
import { StudentList } from "../StudentList";

import { useStyles } from "./PreviousClassSheet.styles";

interface PreviousClassSheetProps {
  /** La última clase del grupo; sin ella, el panel no se abre. */
  item: ScheduleClass | null;
  /** Cómo está su asistencia (`attendanceState`), con la ventana que manda Core. */
  attendance: AttendanceState;
  /** Al tocar ✓ o ✗ de uno (`useMarkStudent` con la escuela y la asistencia de esa clase). */
  onMark: (student: ClassStudent, status: AttendanceStatus) => void;
  visible: boolean;
  onClose: () => void;
}

/**
 * El panel de la última clase del grupo, como el prototipo: «Última clase», su
 * título y su día, su asistencia y la lista de sus alumnos con la marca de cada
 * uno. Mientras su plazo sigue abierto (la clase de ayer) se puede marcar desde
 * aquí, como en el detalle; pasado, la marca se ve y tocarla dice por qué ya no
 * cambia. Va fuera del `BlurTarget` de la pantalla, como todo `BottomSheet`.
 */
export function PreviousClassSheet({ item, attendance, onMark, visible, onClose }: PreviousClassSheetProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const summary = item ? attendanceSummary(item.students) : null;

  return (
    <BottomSheet visible={visible && item !== null} onClose={onClose}>
      {item && summary ? (
        <View style={styles.content} testID="previous-class-sheet">
          <Text variant="subtitle" accessibilityRole="header">
            {t("schedule.detail.lastClassSheet")}
          </Text>
          <Text variant="metaStrong" color="textSecondary">
            {joinParts([
              item.title,
              capitalize(formatWeekdayShortDayMonth(item.class_date)),
              t("schedule.detail.lastClassAttendance", summary),
            ])}
          </Text>
          <StudentList students={item.students} attendance={attendance} onMark={onMark} />
        </View>
      ) : null}
    </BottomSheet>
  );
}
