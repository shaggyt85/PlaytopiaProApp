import type { ThemeColor } from "@/shared/config/theme";
import { makeStyles } from "@/shared/hooks/makeStyles";
import { withAlpha } from "@/shared/utils/color";

/**
 * Sobre qué va el botón: la superficie (la campana, la X de los paneles), un
 * color (la ← del detalle) o nada (`plain`: las flechas de la agenda, solo el
 * icono en gris).
 */
export type IconButtonVariant = "surface" | "onColor" | "plain";

/** El color del icono de cada variante. */
export const ICON_COLOR = {
  surface: "text",
  onColor: "onPrimary",
  plain: "textSecondary",
} as const satisfies Record<IconButtonVariant, ThemeColor>;

export const useStyles = makeStyles((theme) => ({
  circle: { alignItems: "center", justifyContent: "center" },
  surface: {
    backgroundColor: theme.colors.surfaceStrong,
    borderWidth: 1,
    borderColor: theme.colors.hairline,
  },
  // Sobre un degradado: `bg-black/20`, sin borde.
  onColor: { backgroundColor: withAlpha(theme.colors.background, 0.2) },
  plain: {},
  pressed: { transform: [{ scale: 0.95 }] },
}));
