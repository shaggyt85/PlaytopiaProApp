import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { joinParts } from "@/shared/utils/joinParts";

/**
 * «Ciudad · Dirección» de una sede, sin separador sobrante si falta una de las
 * dos. Vacío si no hay ninguna.
 */
export function schoolLocation({ city, address }: Pick<SchoolCard, "city" | "address">): string {
  return joinParts([city, address]);
}
