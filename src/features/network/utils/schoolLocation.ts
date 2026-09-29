import type { SchoolCard } from "../schemas/network.schema";

/**
 * «Ciudad · Dirección» de una sede, sin separador sobrante si falta una de las
 * dos. Vacío si no hay ninguna.
 */
export function schoolLocation({ city, address }: Pick<SchoolCard, "city" | "address">): string {
  return [city, address]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" · ");
}
