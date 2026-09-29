import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `grid grid-cols-7 gap-1.5`.
  row: { flexDirection: "row", gap: theme.spacing.xs + theme.spacing.xs / 2 },
  // La forma de cada día: `rounded-2xl py-2.5`; el aspecto lo pone `DayButton`.
  pill: {
    flex: 1,
    justifyContent: "flex-start",
    paddingVertical: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
  },
}));
