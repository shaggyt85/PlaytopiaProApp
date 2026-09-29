import { makeStyles } from "@/shared/hooks/makeStyles";

import { PAST_OPACITY } from "../../utils/timelineMetrics";

/** El cuadrado de la hora (`h-12 w-12`). */
export const TIME_SQUARE_SIZE = 48;

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-3 rounded-2xl bg-card p-3 ring-soft`.
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.card,
  },
  past: { opacity: PAST_OPACITY },
  content: { flex: 1, minWidth: 0, gap: theme.spacing.xs / 2 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  title: { flexShrink: 1 },
}));
