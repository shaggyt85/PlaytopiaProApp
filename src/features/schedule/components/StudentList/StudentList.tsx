import { View } from "react-native";

import { useTranslation } from "@/shared/hooks/useTranslation";

import type { StudentName } from "../../schemas/schedule.schema";
import { EmptyNote } from "../EmptyNote";
import { StudentRow } from "../StudentRow";

import { useStyles } from "./StudentList.styles";

interface StudentListProps {
  /** Ya ordenados por el contrato de la clase. */
  students: readonly StudentName[];
}

/**
 * Los alumnos de la clase, uno por fila, como lista para el lector de pantalla
 * (dice cuántos hay y va fila a fila). Sin alumnos, «Aún no hay alumnos
 * apuntados». Los alumnos no traen id: la clave es su posición en la lista
 * ordenada, que no cambia entre pintados.
 */
export function StudentList({ students }: StudentListProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  if (students.length === 0) return <EmptyNote message={t("schedule.detail.noStudents")} testID="no-students" />;

  return (
    <View style={styles.rows} accessibilityRole="list" testID="student-list">
      {students.map((student, index) => (
        <StudentRow key={index} student={student} index={index} />
      ))}
    </View>
  );
}
