import { IconLoActivity } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { EmptyNote } from "@/shared/components/EmptyNote";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { StudentAvatar } from "@/shared/components/StudentAvatar";
import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ClassStudent } from "@/shared/schemas/schedule.schema";
import { formatLevel } from "@/shared/utils/formatLevel";
import { joinParts } from "@/shared/utils/joinParts";
import { studentName } from "@/shared/utils/studentName";

import { LEVEL_ICON_SIZE, useStyles } from "./GroupStudentsCard.styles";

interface GroupStudentsCardProps {
  /** Los del grupo, ya sin los que vienen a recuperar (ordenados por el contrato). */
  students: readonly ClassStudent[];
}

/**
 * «Alumnos del grupo», como el prototipo: un panel con el círculo, el nombre y
 * el nivel de cada uno («2,0»), en filas separadas por una línea fina, como
 * lista para el lector de pantalla. Las filas no se tocan hasta que exista la
 * ficha del alumno. Sin alumnos, «Aún no hay alumnos apuntados».
 *
 * Provisional: el nivel lleva `IconLoActivity` hasta que `@playtopia/icons`
 * publique `IconLoBarChart2` (1.10.0).
 */
export function GroupStudentsCard({ students }: GroupStudentsCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <View style={styles.card} testID="group-students">
      <View style={styles.label}>
        <SectionLabel label={t("groups.detail.students")} />
      </View>
      {students.length === 0 ? (
        <View style={styles.empty}>
          <EmptyNote message={t("schedule.detail.noStudents")} />
        </View>
      ) : (
        <View accessibilityRole="list">
          {students.map((student, index) => {
            const name = studentName(student);
            const level = student.level === null ? null : formatLevel(student.level);
            return (
              <View
                key={student.student_id}
                style={styles.row}
                accessible
                accessibilityLabel={joinParts([name, level && t("schedule.next.level", { range: level })], ", ")}
                testID="group-student"
              >
                <StudentAvatar student={student} index={index} size="sm" />
                <Text variant="rowLabel" numberOfLines={1} style={styles.name}>
                  {name}
                </Text>
                {level ? (
                  <View style={styles.level}>
                    <IconLoActivity size={LEVEL_ICON_SIZE} color={theme.colors.primary} />
                    <Text variant="strong">{level}</Text>
                  </View>
                ) : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
