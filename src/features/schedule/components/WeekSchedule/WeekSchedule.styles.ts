import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: { gap: theme.spacing.xs },
  // `mt-5 space-y-5`: una tarjeta por día.
  cards: { marginTop: theme.spacing.md + theme.spacing.xs, gap: theme.spacing.md + theme.spacing.xs },
}));
