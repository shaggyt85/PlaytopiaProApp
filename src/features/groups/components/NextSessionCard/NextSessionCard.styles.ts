import { makeStyles } from "@/shared/hooks/makeStyles";

/** La flecha (`h-4 w-4`). */
export const CHEVRON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `rounded-lg border bg-surface-2/60 p-4 ring-soft`, como «Alumnos del grupo».
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surface,
  },
  // `mt-2 flex items-center justify-between gap-3`.
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.sm + theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  texts: { flex: 1 },
  // `mt-1`.
  enrolled: { marginTop: theme.spacing.xs },
}));
