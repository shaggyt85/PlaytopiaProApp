import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

// Campo de fecha de la app de alumnos: cristal, esquinas de 12 y 14 de alto
// alrededor del texto.
const FIELD_PADDING = 14;

export const useStyles = makeStyles((theme) => ({
  container: { gap: theme.spacing.sm },
  field: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: FIELD_PADDING,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: "transparent",
    backgroundColor: theme.colors.glass,
  },
  fieldError: { borderColor: theme.colors.danger },
  value: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: withAlpha(theme.colors.background, 0.6),
  },
  sheet: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceStrong,
  },
  actions: { flexDirection: "row", gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  action: { flex: 1 },
}));
