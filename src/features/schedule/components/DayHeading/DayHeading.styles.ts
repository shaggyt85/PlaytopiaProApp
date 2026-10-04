import type { TextVariant } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Dónde va la cabecera: dentro de la tarjeta de un día de la Semana o como franja sobre las clases de un día del Mes. */
export type DayHeadingSize = "card" | "strip";

/** El título de cada tamaño: «Miércoles 18» (`text-lg`) o «Miércoles 18 de noviembre» (`text-[13px]`). */
export const DAY_HEADING_TITLE = {
  card: "subtitle",
  strip: "smallTitle",
} as const satisfies Record<DayHeadingSize, TextVariant>;

export const useStyles = makeStyles((theme) => ({
  // `flex items-baseline justify-between`: el título (con «HOY») y, a la derecha, cuántas clases.
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
  },
  // En la tarjeta de la Semana: `mb-3`.
  card: { marginBottom: theme.spacing.sm + theme.spacing.xs },
  // La franja del Mes: `rounded-2xl px-4 py-2.5 ring-1 bg-surface ring-border/40`.
  strip: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.border, 0.4),
    backgroundColor: theme.colors.surface,
  },
  // El día activo del Mes: `bg-lime/10 ring-lime/40`.
  active: {
    borderColor: withAlpha(theme.colors.primary, 0.4),
    backgroundColor: withAlpha(theme.colors.primary, 0.1),
  },
  title: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, flexShrink: 1 },
  titleText: { flexShrink: 1 },
}));
