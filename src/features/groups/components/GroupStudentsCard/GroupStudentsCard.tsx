import { View } from "react-native";

import { Chevron } from "@/shared/components/Chevron";
import { EmptyNote } from "@/shared/components/EmptyNote";
import { IconText } from "@/shared/components/IconText";
import { PressableScale } from "@/shared/components/PressableScale";
import { SectionLabel } from "@/shared/components/SectionLabel";
import { StudentAvatar } from "@/shared/components/StudentAvatar";
import { Text } from "@/shared/components/Text";
import { LEVEL_ICON } from "@/shared/config/icons";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { ClassStudent } from "@/shared/schemas/schedule.schema";
import { formatLevel } from "@/shared/utils/formatLevel";
import { joinParts } from "@/shared/utils/joinParts";
import { fullName } from "@/shared/utils/fullName";

import { useStyles } from "./GroupStudentsCard.styles";

interface GroupStudentsCardProps {
  /** Los del grupo, ya sin los que vienen a recuperar (ordenados por el contrato). */
  students: readonly ClassStudent[];
  /** Abre la ficha de un alumno. */
  onOpen: (student: ClassStudent) => void;
}

/**
 * «Alumnos del grupo», como el prototipo: un panel con el círculo, el nombre y
 * el nivel de cada uno («2,0») y su ›, en filas separadas por una línea fina,
 * como lista para el lector de pantalla. Cada fila abre la ficha del alumno y
 * se encoge al tocarla. Sin alumnos, «Aún no hay alumnos apuntados».
 */
export function GroupStudentsCard({ students, onOpen }: GroupStudentsCardProps) {
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
            const name = fullName(student);
            const level = formatLevel(student.level);
            return (
              <PressableScale
                key={student.student_id}
                onPress={() => onOpen(student)}
                accessibilityLabel={joinParts([name, level && t("schedule.next.level", { range: level })], ", ")}
                accessibilityHint={t("groups.detail.openStudentHint")}
                style={styles.row}
                testID="group-student"
              >
                <StudentAvatar student={student} index={index} size="sm" />
                <Text variant="rowLabel" numberOfLines={1} style={styles.name}>
                  {name}
                </Text>
                {level ? <IconText Icon={LEVEL_ICON} label={level} size="row" color="text" iconColor="primary" /> : null}
                <Chevron />
              </PressableScale>
            );
          })}
        </View>
      )}
    </View>
  );
}
