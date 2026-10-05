import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `px-5 pt-2`, como las secciones del prototipo.
  content: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.lg },
}));
