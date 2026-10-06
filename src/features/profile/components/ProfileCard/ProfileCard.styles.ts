import { makeStyles } from "@/shared/hooks/makeStyles";

/** El icono del título (`h-4 w-4`). */
export const PROFILE_CARD_ICON_SIZE = 16;

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl bg-card p-4 ring-soft`.
  card: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.xxxl,
    backgroundColor: theme.colors.card,
    ...theme.ringSoft,
  },
  // `mb-2 flex items-center gap-2`.
  head: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm, marginBottom: theme.spacing.sm },
  // `space-y-1.5`.
  body: { gap: theme.spacing.xs + theme.spacing.xs / 2 },
}));
