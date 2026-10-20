import { fieldInvalid, solidField } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

// Campo de Playtopia: píldora "cristal" sobre el fondo de marca. El registro
// usa la misma píldora, sólida y con borde del color primario.

export const useStyles = makeStyles((theme) => ({
  field: {
    flexDirection: "row",
    alignItems: "center",
    height: theme.controlHeight,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.glassBorder,
    backgroundColor: theme.colors.glass,
  },
  solid: solidField(theme),
  solidInput: theme.typography.body,
  // Varias líneas: ni alto fijo ni píldora (`rounded-2xl p-3`).
  multilineField: {
    height: undefined,
    minHeight: theme.controlHeight * 2,
    alignItems: "flex-start",
    borderRadius: theme.radius.xxl,
  },
  multilineInput: { height: undefined, paddingVertical: theme.spacing.sm + theme.spacing.xs },
  fieldError: fieldInvalid(theme),
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: theme.spacing.md,
  },
  accessory: { paddingRight: theme.spacing.xs },
  // Lo escrito de lo que cabe, a la derecha bajo el campo.
  counter: { alignSelf: "flex-end" },
}));
