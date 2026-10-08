import { makeStyles } from "@/shared/hooks/makeStyles";

// La cabecera, el círculo del icono y los botones son de `PromptSheet`: aquí
// solo lo propio de esta oferta, sus ventajas.
export const useStyles = makeStyles((theme) => ({
  benefits: { gap: theme.spacing.sm + theme.spacing.xs },
  benefit: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm + theme.spacing.xs,
  },
}));
