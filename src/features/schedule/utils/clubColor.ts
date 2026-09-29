import type { ColorPair } from "@/shared/config/theme";

/**
 * El color del club en la posición `index` de «Mis clubes»: el de su sitio en la
 * paleta, en ciclo cuando hay más clubes que colores. Fijo por posición y no
 * aleatorio, para que el mismo club salga igual cada vez que se abre la app.
 */
export function clubColor<T extends ColorPair>(palette: readonly T[], index: number): T {
  return palette[index % palette.length];
}
