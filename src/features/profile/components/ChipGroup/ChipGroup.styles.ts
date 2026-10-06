import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Su título encima (`mb-2`) y los chips en filas (`flex flex-wrap gap-2`).
  group: { gap: theme.spacing.sm },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
}));
