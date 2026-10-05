import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

/** Dónde va la fila: cada sitio del prototipo con su icono, su texto y su hueco. */
export type IconTextSize = "meta" | "card" | "hero" | "row" | "rowTitle" | "heading";

/**
 * El icono y el texto de cada tamaño:
 * - `meta`: la línea de datos de una tarjeta o fila (`h-3 w-3` y `text-[11px]`):
 *   la sede en «Red de clubes», la duración en Semana, la calle del club.
 * - `card`: la tarjeta de arriba de la agenda (`h-3.5 w-3.5`, `text-[13px]`).
 * - `hero`: la cabecera del detalle de una clase, sobre su color (`text-xs font-semibold`).
 * - `row`: el dato a la derecha de una fila de lista, como el nivel de cada
 *   alumno del grupo (`h-4 w-4`, `font-semibold`).
 * - `rowTitle`: debajo del título de una tarjeta, como el nivel de un grupo en
 *   «Mis grupos» (`h-4 w-4`, `text-sm font-bold`).
 * - `heading`: junto al título de una pantalla, como el nivel en la cabecera
 *   del detalle de un grupo (`h-5 w-5`, `font-display text-lg`).
 */
export const ICON_TEXT_SIZES = {
  meta: { icon: 12, variant: "meta" },
  card: { icon: 14, variant: "caption" },
  hero: { icon: 14, variant: "labelStrong" },
  row: { icon: 16, variant: "strong" },
  rowTitle: { icon: 16, variant: "rowTitle" },
  heading: { icon: 20, variant: "subtitle" },
} as const satisfies Record<IconTextSize, { icon: number; variant: TextVariant }>;

export const useStyles = makeStyles((theme) => {
  // `gap-1.5`: en la tarjeta de arriba, en una fila de lista y junto a un título.
  const wide = { gap: theme.spacing.xs + theme.spacing.xs / 2 };
  return {
    line: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
    // El hueco entre icono y texto de cada tamaño: `gap-1` o `gap-1.5`.
    meta: { gap: theme.spacing.xs },
    card: wide,
    hero: { gap: theme.spacing.xs },
    row: wide,
    rowTitle: wide,
    heading: wide,
    text: { flexShrink: 1 },
  };
});
