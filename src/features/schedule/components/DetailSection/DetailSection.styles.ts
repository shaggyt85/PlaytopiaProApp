import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // `pt-5`, y el título con `mb-2` sobre su contenido.
  section: { paddingTop: theme.spacing.md + theme.spacing.xs, gap: theme.spacing.sm },
  // `flex items-center justify-between`: el título y, a su derecha, su resumen.
  head: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: theme.spacing.sm },
}));
