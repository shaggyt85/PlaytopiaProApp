import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-3 rounded-2xl bg-surface p-2.5 ring-soft`.
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
  },
  name: { flex: 1 },
}));
