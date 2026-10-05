import { View } from "react-native";

import { EmptyNote } from "@/shared/components/EmptyNote";
import { IconText } from "@/shared/components/IconText";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { StudentAvatar } from "@/shared/components/StudentAvatar";
import { Text } from "@/shared/components/Text";
import { LEVEL_ICON } from "@/shared/config/icons";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ClassStudent } from "@/shared/schemas/schedule.schema";
import { formatLevel } from "@/shared/utils/formatLevel";
import { joinParts } from "@/shared/utils/joinParts";
import { studentName } from "@/shared/utils/studentName";

import { useStyles } from "./GroupStudentsCard.styles";

interface GroupStudentsCardProps {
  /** Los del grupo, ya sin los que vienen a recuperar (ordenados por el contrato). */
  students: readonly ClassStudent[];
}

/**
 * «Alumnos del grupo», como el prototipo: un panel con el círculo, el nombre y
 * el nivel de cada uno («2,0»), en filas separadas por una línea fina, como
 * lista para el lector de pantalla. Las filas no se tocan hasta que exista la
 * ficha del alumno. Sin alumnos, «Aún no hay alumnos apuntados».
 */
export function GroupStudentsCard({ students }: GroupStudentsCardProps) {
  const styles = useStyles();
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
            const level = formatLevel(student.level);
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
                {level ? <IconText Icon={LEVEL_ICON} label={level} size="row" color="text" iconColor="primary" /> : null}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}
