import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `pt-5`, y el título con `mb-2` sobre su contenido.
  section: { paddingTop: theme.spacing.md + theme.spacing.xs, gap: theme.spacing.sm },
}));
