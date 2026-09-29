import type { SchoolCard } from "../schemas/network.schema";

/**
 * La identidad de una sede: su escuela y su sucursal (la misma sucursal en otra
 * escuela es otra sede). Clave de las filas, del reciclado de la portada y de
 * la deduplicación de páginas.
 */
export const sedeKey = ({ db_id, club_id }: Pick<SchoolCard, "db_id" | "club_id">) => `${db_id}-${club_id}`;
