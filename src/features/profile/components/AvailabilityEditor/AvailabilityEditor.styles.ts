import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Cada bloque con su etiqueta encima.
  block: { gap: theme.spacing.sm },
  // `flex flex-wrap gap-2`.
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  week: { gap: theme.spacing.xs },
}));
