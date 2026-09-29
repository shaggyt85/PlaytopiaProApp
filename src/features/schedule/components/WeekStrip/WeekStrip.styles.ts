import { StyleSheet } from "react-native";

import { halo } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Los puntos de cada día (`h-1 w-1`). */
const DOT = 4;
/** El punto coral de hoy (`h-2 w-2`), con su brillo de 8. */
const TODAY_MARK = 8;
const TODAY_MARK_BLUR = 8;

export const useStyles = makeStyles((theme) => ({
  // `grid grid-cols-7 gap-1.5`.
  row: { flexDirection: "row", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // `flex flex-col items-center rounded-2xl py-2.5`.
  pill: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
  },
  fill: { ...StyleSheet.absoluteFill, borderRadius: theme.radius.xxl },
  // El marcado: `gradient-lime btn-3d-lime`.
  selected: theme.shadows.raised,
  // Hoy sin marcar: `bg-lime/15 ring-1 ring-lime/40`.
  today: {
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.4),
    backgroundColor: withAlpha(theme.colors.primary, 0.15),
  },
  // Los demás: `bg-surface ring-soft`.
  other: { borderWidth: 1, borderColor: theme.colors.hairline, backgroundColor: theme.colors.surface },
  // `mt-1 flex h-1 items-center gap-0.5`: el hueco se guarda aunque no haya puntos.
  dots: { flexDirection: "row", height: DOT, gap: theme.spacing.xs / 2, marginTop: theme.spacing.xs },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  // Sobre el degradado, blancos al 80 % (`bg-primary-foreground/80`).
  dotOnBrand: { backgroundColor: withAlpha(theme.colors.onPrimary, 0.8) },
  // `absolute -top-1 right-1 h-2 w-2 rounded-full bg-coral shadow-[0_0_8px_var(--coral)]`.
  todayMark: {
    position: "absolute",
    top: -theme.spacing.xs,
    right: theme.spacing.xs,
    width: TODAY_MARK,
    height: TODAY_MARK,
    borderRadius: TODAY_MARK / 2,
    backgroundColor: theme.accents.coral.color,
    ...halo(theme.accents.coral.color, TODAY_MARK_BLUR),
  },
}));
