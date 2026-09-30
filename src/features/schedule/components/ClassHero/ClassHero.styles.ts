import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** La ← (`h-9 w-9`): el `hitSlop` de `IconButton` completa el área táctil. */
export const BACK_SIZE = 36;
/** Los iconos de la línea de la fecha y la pista (`h-3.5 w-3.5`). */
export const META_ICON_SIZE = 14;
/**
 * El halo blanco de la esquina (`-right-12 -top-12 h-44 w-44 bg-white/20
 * blur-3xl`), como el de la tarjeta de la próxima clase pero en blanco.
 */
export const CORNER_GLOW = { fromRight: 40, fromTop: 40, radius: 150, opacity: 0.2 } as const;

export const useStyles = makeStyles((theme) => ({
  // `relative overflow-hidden rounded-3xl p-5 ring-soft`, con el degradado de su club.
  card: {
    overflow: "hidden",
    padding: theme.spacing.md + theme.spacing.xs,
    borderRadius: theme.radius.xxxl,
  },
  fill: StyleSheet.absoluteFill,
  top: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  // El nivel: `rounded-full bg-black/20 px-3 py-1`.
  pill: {
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.pill,
    backgroundColor: withAlpha(theme.colors.background, 0.2),
  },
  title: { marginTop: theme.spacing.md },
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + theme.spacing.xs / 2,
    marginTop: theme.spacing.xs,
  },
  // `text-primary-foreground/90`.
  soft: { opacity: 0.9, flexShrink: 1 },
  // `mt-2 flex flex-wrap items-center gap-x-4 gap-y-1`.
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: theme.spacing.md,
    rowGap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs, flexShrink: 1 },
  // `mt-4 grid gap-2`: una columna por cifra.
  stats: { flexDirection: "row", gap: theme.spacing.sm, marginTop: theme.spacing.md },
}));
