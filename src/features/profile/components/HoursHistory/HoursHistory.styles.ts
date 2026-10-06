import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `mt-3 flex items-center justify-between rounded-2xl bg-surface px-3 py-2.5 ring-soft`.
  toggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm + theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm + theme.spacing.xs,
    paddingVertical: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    backgroundColor: theme.colors.surface,
    ...theme.ringSoft,
  },
  label: { flex: 1 },
  // `mt-2 space-y-0.5`.
  months: { marginTop: theme.spacing.sm, gap: theme.spacing.xs / 2 },
}));
