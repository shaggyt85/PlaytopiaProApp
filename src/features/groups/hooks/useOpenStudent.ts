import { useRouter } from "expo-router";
import { useCallback } from "react";

import type { ClassStudent } from "@/shared/schemas/schedule.schema";

import { studentDetailHref } from "../utils/studentRoute";

/**
 * Abrir la ficha de un alumno del grupo `groupId` de la escuela `dbId`. Estable
 * para un mismo grupo: las filas no se repintan por ella.
 */
export function useOpenStudent(dbId: number, groupId: number) {
  const router = useRouter();
  return useCallback(
    ({ student_id }: Pick<ClassStudent, "student_id">) =>
      router.push(studentDetailHref({ dbId, groupId, studentId: student_id })),
    [router, dbId, groupId],
  );
}
