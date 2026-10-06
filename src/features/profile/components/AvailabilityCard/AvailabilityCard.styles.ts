import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Una sede debajo de otra (`space-y-3`), cada una con su nombre, su resumen y sus tramos.
  clubs: { gap: theme.spacing.sm + theme.spacing.xs },
  club: { gap: theme.spacing.xs },
}));
