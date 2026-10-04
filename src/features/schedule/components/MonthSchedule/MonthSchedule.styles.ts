import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // La cuadrícula y, `mt-3`, la lista de los días.
  container: { gap: theme.spacing.sm + theme.spacing.xs },
  // `space-y-5`: un día debajo de otro.
  days: { gap: theme.spacing.md + theme.spacing.xs },
  // `mb-2` entre la franja del día y sus clases.
  day: { gap: theme.spacing.sm },
}));
