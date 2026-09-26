import { makeStyles } from "@/shared/hooks/makeStyles";

export const LOGO_SIZE = 100;

export const useStyles = makeStyles((theme) => ({
  container: {
    alignItems: "center",
    // Con el hueco del formulario (spacing.md) suma 40, como en la app de
    // alumnos: el primer campo queda justo debajo de la versión.
    marginBottom: theme.spacing.lg,
    ...theme.shadows.glow,
  },
  logo: { marginBottom: theme.spacing.sm + theme.spacing.xs },
  title: {
    ...theme.shadows.textGlow,
    marginBottom: theme.spacing.xs,
  },
  version: { opacity: 0.5 },
  subtitle: { marginTop: theme.spacing.sm },
}));
