import { solidField } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";

// La misma píldora sólida que los campos del registro.
const COUNTRY_MIN_WIDTH = 100;
const FLAG_SIZE = 20;

export const useStyles = makeStyles((theme) => {
  const pill = solidField(theme);

  return {
    container: { gap: theme.spacing.sm },
    row: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
    country: {
      ...pill,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      minWidth: COUNTRY_MIN_WIDTH,
      paddingHorizontal: theme.spacing.md - theme.spacing.xs,
    },
    flag: { fontSize: FLAG_SIZE },
    code: { ...theme.typography.strong, marginLeft: theme.spacing.sm },
    input: {
      ...pill,
      ...theme.typography.body,
      flex: 1,
      paddingHorizontal: theme.spacing.md,
      color: theme.colors.text,
    },
    fieldError: { borderColor: theme.colors.danger },
  };
});
