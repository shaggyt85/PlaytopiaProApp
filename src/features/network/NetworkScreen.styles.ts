import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Cada lista ocupa la pestaña entera; la que no se ve, fuera del dibujo y del lector.
  list: { flex: 1 },
  hidden: { display: "none" },
  // `px-5 pb-3` de Lovable.
  tabs: { paddingHorizontal: theme.gutter, paddingBottom: theme.spacing.sm + theme.spacing.xs },
}));
