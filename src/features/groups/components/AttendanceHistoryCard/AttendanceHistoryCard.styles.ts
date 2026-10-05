import { panel } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

export const useStyles = makeStyles((theme) => ({
  // `rounded-lg border bg-surface-2/60 p-4 ring-soft`.
  card: { ...panel(theme), padding: theme.spacing.md },
  // `flex items-baseline justify-between`.
  top: { flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" },
  // `mt-2 flex items-baseline gap-1`.
  total: { flexDirection: "row", alignItems: "baseline", gap: theme.spacing.xs, marginTop: theme.spacing.sm },
  // `mt-3 grid grid-cols-10 gap-1`: cada clase, una columna igual.
  dots: { flexDirection: "row", gap: theme.spacing.xs, marginTop: theme.spacing.sm + theme.spacing.xs },
  // `mt-3 rounded-md bg-gold/10 px-3 py-2`.
  alert: {
    marginTop: theme.spacing.sm + theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.sm,
    backgroundColor: withAlpha(theme.accents.gold.color, 0.1),
  },
}));
