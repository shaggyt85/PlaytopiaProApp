import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";

/**
 * La identidad de una sede: su escuela y su sucursal (la misma sucursal en otra
 * escuela es otra sede). Clave de las filas, del reciclado de la portada, de la
 * deduplicación de páginas y del club de cada clase de la agenda.
 */
export const sedeKey = ({ db_id, club_id }: Pick<SchoolCard, "db_id" | "club_id">) => `${db_id}-${club_id}`;
