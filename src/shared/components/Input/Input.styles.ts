import { makeStyles } from "@/shared/hooks/makeStyles";

// Campo de Playtopia (el de la app de alumnos): píldora "cristal" sobre el
// fondo de marca. El registro usa la misma píldora, sólida y con borde violeta.
const FIELD_HEIGHT = 48;

export const useStyles = makeStyles((theme) => ({
  container: { gap: theme.spacing.sm },
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: FIELD_HEIGHT,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.glass,
  },
  solid: { backgroundColor: theme.colors.field, borderColor: theme.colors.primary },
  solidInput: theme.typography.body,
  fieldError: { borderColor: theme.colors.danger },
  input: {
    ...theme.typography.input,
    flex: 1,
    height: "100%",
    paddingHorizontal: theme.spacing.md,
    color: theme.colors.text,
  },
  accessory: { paddingRight: theme.spacing.xs },
}));
