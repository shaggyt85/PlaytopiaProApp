import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  container: { gap: theme.spacing.md + theme.spacing.xs },
  // `mt-5`, y el título con `mb-3` sobre sus clases.
  day: { gap: theme.spacing.sm + theme.spacing.xs },
}));
