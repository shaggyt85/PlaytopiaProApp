import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

/** Dónde va la fila: cada sitio del prototipo con su icono, su texto y su hueco. */
export type IconTextSize = "meta" | "card" | "hero";

/**
 * El icono y el texto de cada tamaño:
 * - `meta`: la línea de datos de una tarjeta o fila (`h-3 w-3` y `text-[11px]`):
 *   la sede en «Red de clubes», la duración en Semana, la calle del club.
 * - `card`: la tarjeta de arriba de la agenda (`h-3.5 w-3.5`, `text-[13px]`).
 * - `hero`: la cabecera del detalle de una clase, sobre su color (`text-xs`).
 */
export const ICON_TEXT_SIZES = {
  meta: { icon: 12, variant: "meta" },
  card: { icon: 14, variant: "caption" },
  hero: { icon: 14, variant: "small" },
} as const satisfies Record<IconTextSize, { icon: number; variant: TextVariant }>;

export const useStyles = makeStyles((theme) => ({
  row: { flexDirection: "row", alignItems: "center", flexShrink: 1 },
  // El hueco entre icono y texto: `gap-1` y, en la tarjeta de arriba, `gap-1.5`.
  meta: { gap: theme.spacing.xs },
  card: { gap: theme.spacing.xs + theme.spacing.xs / 2 },
  hero: { gap: theme.spacing.xs },
  text: { flexShrink: 1 },
}));
