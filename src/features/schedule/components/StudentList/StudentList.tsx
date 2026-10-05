import { View } from "react-native";

import { useTranslation } from "@/shared/hooks/useTranslation";

import type { AttendanceStatus, ClassStudent } from "../../schemas/schedule.schema";
import type { AttendanceState } from "../../utils/attendanceWindow";
import { EmptyNote } from "../EmptyNote";
import { StudentRow } from "../StudentRow";

import { useStyles } from "./StudentList.styles";

interface StudentListProps {
  /** Ya ordenados por el contrato de la clase. */
  students: readonly ClassStudent[];
  /** Cómo está la asistencia de la clase (`attendanceState`). */
  attendance: AttendanceState;
  /** Al tocar ✓ o ✗ de uno (`useMarkStudent`). Estable, para no repintar cada fila. */
  onMark: (student: ClassStudent, status: AttendanceStatus) => void;
}

/**
 * Los alumnos de la clase, uno por fila, como lista para el lector de pantalla
 * (dice cuántos hay y va fila a fila). Sin alumnos, «Aún no hay alumnos
 * apuntados». Cada fila, por la clase en la que está inscrito el alumno y su
 * id: quien recupera está en su plaza.
 */
export function StudentList({ students, attendance, onMark }: StudentListProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  if (students.length === 0) return <EmptyNote message={t("schedule.detail.noStudents")} testID="no-students" />;

  return (
    <View style={styles.rows} accessibilityRole="list" testID="student-list">
      {students.map((student, index) => (
        <StudentRow
          key={`${student.class_id}-${student.student_id}`}
          student={student}
          index={index}
          attendance={attendance}
          onMark={onMark}
        />
      ))}
    </View>
  );
}
