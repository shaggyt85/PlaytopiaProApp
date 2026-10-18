import { z } from "zod";

import { ROUTES } from "@/shared/config/routes";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";

const positiveId = z.coerce.number().int().positive();

/**
 * Los parámetros de la ruta del detalle, que llegan como texto: la escuela (el id
 * de una clase solo es único dentro de ella), la clase y su fecha (en qué mes de
 * la agenda está). Es lo que arma `classDetailHref`: un test comprueba que lo
 * que arma una lo acepta el otro.
 */
export const ClassDetailParamsSchema = z.object({
  dbId: positiveId,
  classId: positiveId,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type ClassDetailParams = z.infer<typeof ClassDetailParamsSchema>;

/** A dónde lleva tocar una clase: su detalle, con su escuela, su id y su fecha. */
export const classDetailHref = ({ db_id, id, class_date }: Pick<ScheduleClass, "db_id" | "id" | "class_date">) => ({
  pathname: ROUTES.classDetail,
  params: { dbId: String(db_id), classId: String(id), date: class_date },
});
