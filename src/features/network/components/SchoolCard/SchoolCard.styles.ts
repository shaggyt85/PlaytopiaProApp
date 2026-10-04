import { STRIPE_WIDTH } from "@/shared/components/StripeCard";
import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `p-4` dentro de la tarjeta con franja (`StripeCard`, `rounded-3xl bg-surface ring-soft`):
  // el contenido deja libre la franja.
  content: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    paddingLeft: theme.spacing.md + STRIPE_WIDTH,
  },
}));
