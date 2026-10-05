import { z } from "zod";

/** La ruta del detalle de un grupo (`src/app/(app)/group/[dbId]/[groupId].tsx`). */
const GROUP_DETAIL_PATH = "/group/[dbId]/[groupId]";

const positiveId = z.coerce.number().int().positive();

/**
 * Los parámetros de la ruta del detalle de un grupo, que llegan como texto: la
 * escuela (el id de un grupo solo es único dentro de ella) y el grupo. Es lo que
 * arma `groupDetailHref`: un test comprueba que lo que arma una lo acepta el otro.
 */
export const GroupDetailParamsSchema = z.object({
  dbId: positiveId,
  groupId: positiveId,
});

export type GroupDetailParams = z.infer<typeof GroupDetailParamsSchema>;

/** A dónde lleva tocar un grupo: su detalle, con su escuela y su id. */
export const groupDetailHref = (dbId: number, groupId: number) => ({
  pathname: GROUP_DETAIL_PATH,
  params: { dbId: String(dbId), groupId: String(groupId) },
});
