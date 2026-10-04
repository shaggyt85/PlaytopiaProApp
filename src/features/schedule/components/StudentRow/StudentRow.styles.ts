import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `flex items-center gap-3 rounded-2xl bg-surface p-2.5 ring-soft`.
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs,
    padding: theme.spacing.sm + theme.spacing.xs / 2,
    borderRadius: theme.radius.xxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surface,
  },
  // El alumno: el círculo y sus textos, que se leen juntos.
  who: { flex: 1, flexDirection: "row", alignItems: "center", gap: theme.spacing.sm + theme.spacing.xs },
  texts: { flex: 1 },
  // `mt-0.5 flex flex-wrap items-center gap-x-1.5 gap-y-0.5`.
  meta: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: theme.spacing.xs + theme.spacing.xs / 2,
    rowGap: theme.spacing.xs / 2,
    marginTop: theme.spacing.xs / 2,
  },
  // `flex gap-1.5`.
  toggles: { flexDirection: "row", gap: theme.spacing.xs + theme.spacing.xs / 2 },
}));
