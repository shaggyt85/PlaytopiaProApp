import { makeStyles } from "@/shared/hooks/makeStyles";

// Ancho máximo del formulario: en tablet u horizontal no se estira (guía §13).
const FORM_MAX_WIDTH = 420;
// Hueco superior para que el contenido no quede bajo el botón de volver.
const TOP_GAP = 60;

export const useStyles = makeStyles((theme) => ({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.lg,
    paddingTop: TOP_GAP,
    paddingBottom: theme.spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: FORM_MAX_WIDTH,
    gap: theme.spacing.md,
  },
}));
