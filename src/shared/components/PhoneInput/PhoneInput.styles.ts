import { makeStyles } from "@/shared/hooks/makeStyles";

// La misma píldora sólida que los campos del registro.
const FIELD_HEIGHT = 48;
const COUNTRY_MIN_WIDTH = 100;
const FLAG_SIZE = 20;

export const useStyles = makeStyles((theme) => {
  const pill = {
    height: FIELD_HEIGHT,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.field,
  } as const;

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
    code: { fontWeight: "600", marginLeft: theme.spacing.sm },
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
