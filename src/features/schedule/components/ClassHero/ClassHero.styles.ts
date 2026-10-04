import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";

/** La ← (`h-9 w-9`): el `hitSlop` de `IconButton` completa el área táctil. */
export const BACK_SIZE = 36;
/**
 * El halo blanco de la esquina (`-right-12 -top-12 h-40 w-40 bg-white/20
 * blur-3xl`), como el de la tarjeta de la próxima clase pero en blanco.
 */
export const CORNER_GLOW = { fromRight: 40, fromTop: 40, radius: 150, opacity: 0.2 } as const;

export const useStyles = makeStyles((theme) => ({
  // `relative overflow-hidden rounded-3xl p-4 ring-soft`, con el degradado de la clase.
  card: {
    overflow: "hidden",
    padding: theme.spacing.md,
    borderRadius: theme.radius.xxxl,
  },
  fill: StyleSheet.absoluteFill,
  // `mt-2`.
  title: { marginTop: theme.spacing.sm },
  // `mt-0.5 flex items-center gap-1.5`.
  clubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.xs + theme.spacing.xs / 2,
    marginTop: theme.spacing.xs / 2,
  },
  // `opacity-90`.
  soft: { opacity: 0.9, flexShrink: 1 },
  // `mt-2.5 space-y-1`: la línea del día y la de la pista, el nivel y los alumnos.
  meta: { gap: theme.spacing.xs, marginTop: theme.spacing.sm + theme.spacing.xs / 2 },
  // `flex flex-wrap items-center gap-x-3 gap-y-1`.
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: theme.spacing.sm + theme.spacing.xs,
    rowGap: theme.spacing.xs,
  },
}));
