import { fieldInvalid } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

// Campo de fecha: cristal, esquinas `md` y 14 de alto
// alrededor del texto.
const FIELD_PADDING = 14;

export const useStyles = makeStyles((theme) => ({
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
  fieldError: fieldInvalid(theme),
  value: { flex: 1 },
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.colors.overlay,
  },
  sheet: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    backgroundColor: theme.colors.surfaceStrong,
  },
  // La rueda de iOS tiene su propio ancho: sin esto queda pegada a la izquierda.
  picker: { alignSelf: "center" },
  actions: { flexDirection: "row", gap: theme.spacing.sm, marginTop: theme.spacing.sm },
  action: { flex: 1 },
}));
