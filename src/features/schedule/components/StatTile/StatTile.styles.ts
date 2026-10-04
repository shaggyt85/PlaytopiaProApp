import type { TextVariant, ThemeColor } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El icono (`h-4 w-4`). */
export const ICON_SIZE = 16;

/** Dónde va la cifra: la cabecera del detalle (`hero`) o la fila del día encima de la agenda (`today`). */
export type StatTileVariant = "hero" | "today";

/** El texto de cada variante: la cifra, el color de lo que es y si cabe en una línea (`whitespace-nowrap`). */
export const STAT_TILE_TEXT = {
  hero: { value: "smallTitle", label: "onPrimary", labelLines: undefined },
  today: { value: "statValue", label: "textSecondary", labelLines: 1 },
} as const satisfies Record<
  StatTileVariant,
  { value: TextVariant; label: ThemeColor; labelLines: number | undefined }
>;

export const useStyles = makeStyles((theme) => ({
  // `flex flex-col items-center justify-center gap-1 rounded-2xl bg-black/20 px-2 py-3`.
  heroTile: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxl,
    backgroundColor: withAlpha(theme.colors.background, 0.2),
  },
  // El icono encima de la cifra.
  heroHead: { alignItems: "center", gap: theme.spacing.xs },
  // `opacity-80` el icono y `opacity-90` el texto.
  heroIcon: { opacity: 0.8 },
  heroLabel: { opacity: 0.9 },
  // `flex flex-col items-center gap-1.5`, sin fondo.
  todayTile: { flex: 1, alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // `flex items-center gap-1.5`: el icono al lado de la cifra.
  todayHead: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  todayIcon: {},
  todayLabel: {},
}));
