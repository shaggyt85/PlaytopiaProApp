import { IconLoActivity } from "@playtopia/icons/react-native";
import { memo } from "react";
import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { IconText } from "@/shared/components/IconText";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { joinParts } from "@/shared/utils/joinParts";

import type { AttendanceStatus, ClassStudent } from "../../schemas/schedule.schema";
import { formatLevel } from "../../utils/formatLevel";
import { studentName } from "../../utils/studentName";
import { AttendanceToggle } from "../AttendanceToggle";
import { StudentAvatar } from "../StudentAvatar";

import { useStyles } from "./StudentRow.styles";

interface StudentRowProps {
  student: ClassStudent;
  /** Su posición en la lista ordenada: su color. */
  index: number;
  /** Marca su asistencia; sin ella (la clase aún no ha empezado), sin botones. */
  onMark?: (student: ClassStudent, status: AttendanceStatus) => void;
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
export const StudentRow = memo(function StudentRow({ student, index, onMark }: StudentRowProps) {
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
      {onMark ? (
        <View style={styles.toggles}>
          <AttendanceToggle
            status="present"
            selected={student.attendance === "present"}
            onPress={() => onMark(student, "present")}
            accessibilityLabel={t("schedule.detail.markPresent", { name })}
          />
          <AttendanceToggle
            status="absent"
            selected={student.attendance === "absent"}
            onPress={() => onMark(student, "absent")}
            accessibilityLabel={t("schedule.detail.markAbsent", { name })}
          />
        </View>
      ) : null}
    </View>
  );
});
