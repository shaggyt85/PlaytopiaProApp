import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  safe: { flex: 1 },
  // `px-5 pt-2`, como las secciones del prototipo.
  content: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.sm, paddingBottom: theme.spacing.lg },
}));
