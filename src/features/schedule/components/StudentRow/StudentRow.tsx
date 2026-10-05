import { IconLoActivity } from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { IconText } from "@/shared/components/IconText";
import { StudentAvatar } from "@/shared/components/StudentAvatar";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TranslationKey } from "@/shared/locales";
import type { AttendanceStatus, ClassStudent } from "@/shared/schemas/schedule.schema";
import { formatLevel } from "@/shared/utils/formatLevel";
import { joinParts } from "@/shared/utils/joinParts";
import { studentName } from "@/shared/utils/studentName";

import type { AttendanceState } from "../../utils/attendanceWindow";
import { AttendanceToggle } from "../AttendanceToggle";

import { useStyles } from "./StudentRow.styles";

/** Los botones de la asistencia, en orden, con lo que dice cada uno. */
const TOGGLES = [
  { status: "present", label: "schedule.detail.markPresent" },
  { status: "absent", label: "schedule.detail.markAbsent" },
] as const satisfies readonly { status: AttendanceStatus; label: TranslationKey }[];

interface StudentRowProps {
  student: ClassStudent;
  /** Su posición en la lista ordenada: su color. */
  index: number;
  /**
   * Cómo está la asistencia de la clase: sin botones antes de que se pueda
   * pasar lista, con ellos mientras se puede y, pasado el plazo, la marca a la
   * vista, atenuada.
   */
  attendance: AttendanceState;
  /**
   * Al tocar ✓ o ✗ (`useMarkStudent`): marca con la asistencia abierta y, pasado
   * el plazo, dice por qué ya no cambia. Estable.
   */
  onMark: (student: ClassStudent, status: AttendanceStatus) => void;
}

/**
 * Un alumno de la clase en su detalle, como el prototipo: el círculo con sus
 * iniciales, su nombre y, debajo, «RECUPERACIÓN» si recupera y su nivel; a la
 * derecha, ✓ y ✗ para marcar si vino. El lector de pantalla dice el alumno de
 * una vez y cada botón aparte.
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 */
export const StudentRow = memo(function StudentRow({ student, index, attendance, onMark }: StudentRowProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const name = studentName(student);
  const level = student.level === null ? null : formatLevel(student.level);
  const recovery = student.is_recovery ? t("schedule.detail.recovery") : null;

  return (
    <View style={styles.row} testID="student-row">
      <View
        style={styles.who}
        accessible
        accessibilityLabel={joinParts([name, recovery, level && t("schedule.next.level", { range: level })], ", ")}
      >
        <StudentAvatar student={student} index={index} size="md" />
        <View style={styles.texts}>
          <Text variant="rowLabel" numberOfLines={1}>
            {name}
          </Text>
          {recovery || level ? (
            <View style={styles.meta}>
              {recovery ? <Chip label={recovery} dot={false} tone="gold" /> : null}
              {level ? <IconText Icon={IconLoActivity} label={level} iconColor="primary" /> : null}
            </View>
          ) : null}
        </View>
      </View>
      {attendance === "notYet" ? null : (
        <View style={styles.toggles}>
          {TOGGLES.map(({ status, label }) => (
            <AttendanceToggle
              key={status}
              status={status}
              selected={student.attendance === status}
              locked={attendance === "closed"}
              onPress={() => onMark(student, status)}
              accessibilityLabel={t(label, { name })}
            />
          ))}
        </View>
      )}
    </View>
  );
});
