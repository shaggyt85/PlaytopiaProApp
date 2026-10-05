import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `rounded-2xl bg-surface p-4 text-center ring-soft`: el `ring-soft` como borde fino.
  container: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.xxl,
    ...theme.ringSoft,
    backgroundColor: theme.colors.surface,
  },
}));
