import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Cada bloque con su etiqueta encima (`mb-2`).
  field: { gap: theme.spacing.sm },
}));
