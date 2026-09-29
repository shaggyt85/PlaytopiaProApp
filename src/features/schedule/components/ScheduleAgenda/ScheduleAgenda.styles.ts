import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `px-5`, como el resto de secciones de la pantalla.
  container: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md },
}));
