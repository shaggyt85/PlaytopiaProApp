import { useCallback } from "react";
import { Alert } from "react-native";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { selectionFeedback } from "@/shared/utils/haptics";

import type { AttendanceStatus, ClassStudent } from "../schemas/schedule.schema";
import type { AttendanceState } from "../utils/attendanceWindow";

import { useMarkAttendance } from "./useMarkAttendance";

/**
 * Lo que pasa al tocar ✓ o ✗ de un alumno de una clase de la escuela `dbId`,
 * según su asistencia (`attendanceState`):
 *
 * - Abierta: la marca, con la vibración de elegir, en la clase en la que está
 *   inscrito (su plaza, si recupera). Volver a tocar la que ya tiene no pide nada.
 * - Pasado el plazo: el mismo aviso que daría Core (`attendance-closed`), sin
 *   pedirle nada. Así tocar una marca que ya no se puede cambiar dice por qué.
 *
 * Estable mientras no cambien la escuela ni la asistencia: las filas no se
 * repintan por ella.
 */
export function useMarkStudent(dbId: number, attendance: AttendanceState) {
  const { mutate } = useMarkAttendance();
  const { t } = useTranslation();
  return useCallback(
    (student: ClassStudent, status: AttendanceStatus) => {
      if (attendance === "closed") {
        Alert.alert(t("errors.byType.attendance-closed"));
        return;
      }
      if (attendance !== "open" || student.attendance === status) return;
      selectionFeedback();
      mutate({ target: { dbId, classId: student.class_id, studentId: student.student_id }, status });
    },
    [attendance, dbId, mutate, t],
  );
}
