import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `mb-4`, y el hueco de la X a la derecha.
  title: { marginBottom: theme.spacing.md, paddingRight: theme.spacing.xl },
}));
