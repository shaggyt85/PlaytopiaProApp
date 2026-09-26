import { makeStyles } from "@/shared/hooks/makeStyles";

// Ancho máximo del formulario: en tablet u horizontal no se estira (guía §13).
const FORM_MAX_WIDTH = 420;
const LOGO_SIZE = 88;

export const useStyles = makeStyles((theme) => ({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  content: {
    width: "100%",
    maxWidth: FORM_MAX_WIDTH,
    gap: theme.spacing.lg,
  },
  header: { alignItems: "center", gap: theme.spacing.sm },
  logo: { width: LOGO_SIZE, height: LOGO_SIZE, marginBottom: theme.spacing.sm },
}));
