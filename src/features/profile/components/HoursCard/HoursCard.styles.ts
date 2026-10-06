import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `mb-3` bajo «N clases en pista».
  classes: { marginBottom: theme.spacing.sm + theme.spacing.xs },
  // `space-y-2.5`.
  clubs: { gap: theme.spacing.sm + theme.spacing.xs / 2 },
}));
