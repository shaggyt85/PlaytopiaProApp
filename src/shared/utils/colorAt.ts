import type { ColorPair } from "@/shared/config/theme";

/**
 * El color de la posición `index` de una lista, en ciclo cuando hay más elementos
 * que colores: el de cada club en «Mis clubes» y el de cada alumno en los
 * círculos de la próxima clase. Fijo por posición y no aleatorio, para que salga
 * igual cada vez que se abre la app.
 */
export function colorAt<T extends ColorPair>(palette: readonly T[], index: number): T {
  return palette[index % palette.length];
}
