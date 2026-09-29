import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** El alto del botón (`px-2.5 py-1` con su texto de 10): el `hitSlop` completa hasta 44. */
export const SHOW_ALL_HEIGHT = 24;

export const useStyles = makeStyles((theme) => ({
  // `mt-2 flex items-center justify-between`.
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  text: { flexShrink: 1 },
  // `rounded-full bg-surface px-2.5 py-1 ring-1 ring-lime/30`.
  showAll: {
    minHeight: SHOW_ALL_HEIGHT,
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.3),
    backgroundColor: theme.colors.surface,
  },
}));
