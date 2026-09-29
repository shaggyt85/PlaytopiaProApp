import { makeStyles } from "@/shared/hooks/makeStyles";

/** Ancho de la franja de la izquierda (el `w-1.5` de Lovable). */
export const STRIPE_WIDTH = 6;
/** Icono de la línea de datos (el `h-3 w-3` de Lovable). */
export const META_ICON_SIZE = 12;

export const useStyles = makeStyles((theme) => ({
  // `rounded-3xl bg-surface p-4 ring-soft` de Lovable. El `ring-soft` es una
  // sombra interior, que React Native no tiene: se aproxima con un borde fino.
  card: {
    overflow: "hidden",
    borderRadius: theme.radius.xxxl,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
    backgroundColor: theme.colors.surface,
  },
  stripe: { position: "absolute", top: 0, bottom: 0, left: 0, width: STRIPE_WIDTH },
  content: {
    gap: theme.spacing.xs,
    padding: theme.spacing.md,
    paddingLeft: theme.spacing.md + STRIPE_WIDTH,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: theme.spacing.xs },
  metaText: { flexShrink: 1 },
}));
