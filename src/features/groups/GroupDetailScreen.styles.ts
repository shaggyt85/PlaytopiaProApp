import { makeStyles } from "@/shared/hooks/makeStyles";

/** La ‹ (`h-10 w-10`): el `hitSlop` de `IconButton` completa el área táctil. */
export const BACK_SIZE = 40;
/** El icono del nivel (`h-5 w-5`). */
export const LEVEL_ICON_SIZE = 20;
/** El punto del color del grupo (`h-3 w-3`). */
const DOT = 12;

export const useStyles = makeStyles((theme) => ({
  // `px-5 pt-4`.
  content: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md, paddingBottom: theme.spacing.lg },
  // `mt-4 flex items-center gap-2`.
  titleRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginTop: theme.spacing.md },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  title: { flex: 1 },
  // `flex items-center gap-1.5`.
  level: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // `mt-3`.
  place: { marginTop: theme.spacing.sm + theme.spacing.xs },
  // `mt-2`.
  members: { marginTop: theme.spacing.sm },
  // `mt-5 space-y-4`.
  sections: { gap: theme.spacing.md, marginTop: theme.spacing.md + theme.spacing.xs },
}));
