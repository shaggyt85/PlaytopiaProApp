import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

import { PAST_OPACITY } from "../../utils/timelineMetrics";

/** El cuadrado de la hora (`h-14 w-14`). */
export const TIME_SQUARE_SIZE = 56;

export const useStyles = makeStyles((theme) => ({
  // `flex items-start gap-3 rounded-2xl p-2.5 ring-soft bg-surface`.
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surface,
  },
  // En curso o la próxima: `bg-lime/10 ring-1 ring-lime/40`.
  highlighted: {
    borderColor: withAlpha(theme.colors.primary, 0.4),
    backgroundColor: withAlpha(theme.colors.primary, 0.1),
  },
  past: { opacity: PAST_OPACITY },
  content: { flex: 1, minWidth: 0 },
  // `mt-1 flex items-center gap-1.5`: la marca no se estira a todo el ancho.
  pills: { flexDirection: "row", alignItems: "center", marginTop: theme.spacing.xs },
  metaRow: { marginTop: theme.spacing.xs / 2 },
  seatsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xs + theme.spacing.xs / 2,
  },
}));
