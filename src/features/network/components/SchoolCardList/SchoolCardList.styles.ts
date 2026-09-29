import { makeStyles } from "@/shared/hooks/makeStyles";

export const useStyles = makeStyles((theme) => ({
  // Cada tarjeta con el margen lateral de la pantalla: la cabecera lleva el suyo.
  item: { paddingHorizontal: theme.gutter },
  // `space-y-3` de Lovable.
  separator: { height: theme.spacing.sm + theme.spacing.xs },
  footer: { paddingVertical: theme.spacing.lg },
}));
