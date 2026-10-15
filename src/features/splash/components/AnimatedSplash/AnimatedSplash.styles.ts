import { StyleSheet } from "react-native";

import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

// Medidas propias de la composición del splash (no hay token equivalente).
export const SPLASH_LOGO_SIZE = 120;
/** Separación del hueco de abajo con el borde (más la zona segura). */
export const SPLASH_FOOTER_GAP = 40;

const SPLASH_LAYOUT = {
  logoGap: 60,
  taglineGap: 12,
  taglinePaddingX: 20,
};

const { colors, spacing, radius, typography, shadows, gutter } = darkTheme;

export const styles = StyleSheet.create({
  // Sin zIndex a propósito: el splash es el último hijo del layout y se pinta
  // encima por orden. Un hijo con zIndex que se desmonta durante una
  // transición tumba la app en Android (IndexOutOfBoundsException en
  // getChildDrawingOrder), y el splash se desmonta al terminar.
  container: StyleSheet.absoluteFill,
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    marginBottom: SPLASH_LAYOUT.logoGap,
    ...shadows.glow,
  },
  textContainer: {
    alignItems: "center",
  },
  // El hueco de abajo (la tarjeta de la actualización), con los márgenes de la app.
  footer: {
    position: "absolute",
    left: gutter,
    right: gutter,
  },
  title: {
    ...typography.display,
    ...shadows.textGlow,
    color: colors.text,
  },
  subtitle: {
    marginTop: SPLASH_LAYOUT.taglineGap,
    paddingHorizontal: SPLASH_LAYOUT.taglinePaddingX,
    paddingVertical: spacing.sm,
    backgroundColor: colors.hairline,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.hairlineStrong,
  },
  subtitleText: {
    ...typography.tagline,
    color: withAlpha(colors.text, 0.8),
  },
});
