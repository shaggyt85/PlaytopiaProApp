import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/** Sobre qué va el botón: la superficie (la campana, la X de los paneles) o un color (la ← del detalle). */
export type IconButtonVariant = "surface" | "onColor";

export const useStyles = makeStyles((theme) => ({
  circle: { alignItems: "center", justifyContent: "center" },
  surface: {
    backgroundColor: theme.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
  },
  // Sobre un degradado: `bg-black/20`, sin borde.
  onColor: { backgroundColor: withAlpha(theme.colors.background, 0.2) },
  pressed: { transform: [{ scale: 0.95 }] },
}));
