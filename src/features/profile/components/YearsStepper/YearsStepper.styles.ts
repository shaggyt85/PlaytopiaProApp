import { makeStyles } from "@/shared/hooks/makeStyles";

/** Los botones redondos (`h-10 w-10`). */
const STEP_SIZE = 40;
/** El número entre ellos (`w-10`). */
const VALUE_WIDTH = 40;

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-3`.
  row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm + theme.spacing.xs },
  // `grid h-10 w-10 place-items-center rounded-full bg-surface ring-soft`.
  step: {
    width: STEP_SIZE,
    height: STEP_SIZE,
    borderRadius: STEP_SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.surface,
    ...theme.ringSoft,
  },
  disabled: { opacity: 0.4 },
  value: { width: VALUE_WIDTH, textAlign: "center" },
}));
