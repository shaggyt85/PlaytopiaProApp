/**
 * Une las partes de una línea de datos («Madrid · Calle Mayor 1», «16:00 · 75
 * min · Pista 1») sin separadores sobrantes: lo vacío o en blanco no sale.
 */
export function joinParts(parts: readonly (string | null | undefined)[], separator = " · "): string {
  return parts
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(separator);
}
