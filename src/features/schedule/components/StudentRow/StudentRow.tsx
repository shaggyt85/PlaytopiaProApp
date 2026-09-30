import { memo } from "react";
import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import type { StudentName } from "../../schemas/schedule.schema";
import { studentName } from "../../utils/studentName";
import { StudentAvatar } from "../StudentAvatar";

import { useStyles } from "./StudentRow.styles";

interface StudentRowProps {
  student: StudentName;
  /** Su posición en la lista ordenada: su color. */
  index: number;
}

/**
 * Un alumno de la clase en su detalle: el círculo con sus iniciales y su nombre.
 * Solo para leer: los botones de asistencia llegan con su fase.
 */
export const StudentRow = memo(function StudentRow({ student, index }: StudentRowProps) {
  const styles = useStyles();
  const name = studentName(student);

  return (
    <View style={styles.row} accessible accessibilityLabel={name} testID="student-row">
      <StudentAvatar student={student} index={index} size="md" />
      <Text variant="rowLabel" numberOfLines={1} style={styles.name}>
        {name}
      </Text>
    </View>
  );
});
