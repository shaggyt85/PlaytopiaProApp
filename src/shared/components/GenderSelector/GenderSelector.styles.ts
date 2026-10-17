import { makeStyles } from "@/shared/hooks/makeStyles";

// Botón de opción de la app de alumnos: 14 arriba y abajo alrededor del texto.
const OPTION_PADDING = 14;

export const useStyles = makeStyles((theme) => ({
  options: { flexDirection: "row", gap: theme.spacing.sm, marginBottom: theme.spacing.xs },
  option: {
    flex: 1,
    minHeight: theme.touchTarget,
    paddingVertical: OPTION_PADDING,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: theme.colors.glass,
  },
  optionSelected: { backgroundColor: theme.colors.option, borderColor: theme.colors.option },
}));
