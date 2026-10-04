import { makeStyles } from "@/shared/hooks/makeStyles";

/** Ancho de la franja de la izquierda (el `w-1.5` de Lovable): el contenido la deja libre. */
export const STRIPE_WIDTH = 6;

export const useStyles = makeStyles((theme) => ({
  // `overflow-hidden bg-surface ring-soft`: recorta el fondo y la franja a su radio.
  card: { overflow: "hidden", ...theme.ringSoft, backgroundColor: theme.colors.surface },
  stripe: { position: "absolute", top: 0, bottom: 0, left: 0, width: STRIPE_WIDTH },
}));
