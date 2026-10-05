import { StyleSheet } from "react-native";

import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** La flecha (`h-4 w-4`). */
export const CHEVRON_SIZE = 16;
/** El punto del color del grupo (`h-2.5 w-2.5`). */
const DOT = 10;

export const useStyles = makeStyles((theme) => ({
  // `rounded-lg border border-primary/25 gradient-ink p-4 ring-soft`.
  card: {
    overflow: "hidden",
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(theme.colors.primary, 0.25),
  },
  fill: StyleSheet.absoluteFill,
  // `mt-2 flex items-center gap-2`.
  titleRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2 },
  name: { flex: 1 },
  // `mt-3 space-y-1.5`.
  lines: { gap: theme.spacing.xs + theme.spacing.xs / 2, marginTop: theme.spacing.sm + theme.spacing.xs },
  // `mt-2 flex items-center gap-2 border-t pt-2.5`.
  range: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm + theme.spacing.xs / 2,
    borderTopWidth: 1,
    borderTopColor: theme.colors.hairline,
  },
  rangeLabel: { flex: 1 },
}));
