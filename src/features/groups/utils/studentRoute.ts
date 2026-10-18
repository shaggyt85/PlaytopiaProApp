import { z } from "zod";

import { ROUTES } from "@/shared/config/routes";

const positiveId = z.coerce.number().int().positive();

/**
 * Los parámetros de la ruta de la ficha de un alumno, que llegan como texto: la
 * escuela y el grupo (la ficha es la del alumno en ese grupo: su nivel, su
 * asistencia) y el alumno. Es lo que arma `studentDetailHref`: un test comprueba
 * que lo que arma una lo acepta el otro.
 */
export const StudentDetailParamsSchema = z.object({
  dbId: positiveId,
  groupId: positiveId,
  studentId: positiveId,
});

export type StudentDetailParams = z.infer<typeof StudentDetailParamsSchema>;

/** A dónde lleva tocar un alumno de un grupo: su ficha. */
export const studentDetailHref = ({ dbId, groupId, studentId }: StudentDetailParams) => ({
  pathname: ROUTES.studentDetail,
  params: { dbId: String(dbId), groupId: String(groupId), studentId: String(studentId) },
});
