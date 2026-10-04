import { makeStyles } from "@/shared/hooks/makeStyles";

import { PAST_OPACITY } from "../../utils/timelineMetrics";

/** El cuadrado de la hora (`h-12 w-12`). */
export const TIME_SQUARE_SIZE = 48;
/** La flecha (`h-4 w-4`). */
export const CHEVRON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `flex items-start gap-3 rounded-2xl bg-card p-3 ring-soft`.
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs,
    borderRadius: theme.radius.xxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.card,
  },
  past: { opacity: PAST_OPACITY },
  content: { flex: 1, minWidth: 0, gap: theme.spacing.xs / 2 },
  // `mt-3`: la flecha a la altura del título.
  chevron: { marginTop: theme.spacing.sm + theme.spacing.xs },
}));
