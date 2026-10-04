import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

export const useStyles = makeStyles((theme) => ({
  // `px-5`, como el resto de secciones de la pantalla.
  container: { paddingHorizontal: theme.gutter, paddingTop: theme.spacing.md },
  // `h-px bg-border/40` y, debajo, «MI AGENDA» (`pt-4`).
  divider: { height: 1, backgroundColor: withAlpha(theme.colors.border, 0.4), marginBottom: theme.spacing.md },
}));
