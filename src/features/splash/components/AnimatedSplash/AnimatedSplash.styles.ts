import { StyleSheet } from "react-native";

import { BRAND } from "@/shared/config/brand";
import { darkTheme } from "@/shared/config/theme";
import { withAlpha } from "@/shared/utils/color";

// El splash es marca, no tema: usa siempre los colores de marca.
const glow = (alphas: readonly number[]) =>
  alphas.map((alpha) => withAlpha(BRAND.pink, alpha)) as [string, string, ...string[]];

export const SPLASH_COLORS = {
  gradient: darkTheme.gradients.brand,
  glowStrong: glow([0.25, 0.15, 0.05, 0]),
  glowSoft: glow([0.2, 0.12, 0.04, 0]),
  accent: BRAND.violet,
  text: BRAND.white,
};

// Medidas propias de la composición del splash (no hay token equivalente).
const SPLASH_LAYOUT = {
  logoSize: 120,
  logoGap: 60,
  circleSmall: 300,
  circleLarge: 400,
  taglineGap: 12,
  taglinePaddingX: 20,
  taglineFontSize: 14,
};

const { spacing, radius, typography } = darkTheme;

/** Círculo decorativo: ancho, alto y radio salen de un solo tamaño. */
const circle = (size: number) => ({
  position: "absolute" as const,
  width: size,
  height: size,
  borderRadius: size / 2,
});

export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundCircle1: {
    ...circle(SPLASH_LAYOUT.circleSmall),
    top: -SPLASH_LAYOUT.circleSmall / 3,
    right: -SPLASH_LAYOUT.circleSmall / 3,
  },
  backgroundCircle2: {
    ...circle(SPLASH_LAYOUT.circleLarge),
    bottom: -SPLASH_LAYOUT.circleLarge * 0.375,
    left: -SPLASH_LAYOUT.circleLarge * 0.375,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    marginBottom: SPLASH_LAYOUT.logoGap,
    shadowColor: SPLASH_COLORS.accent,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowOpacity: 0.3,
    shadowRadius: spacing.md,
    elevation: 10,
  },
  logo: {
    width: SPLASH_LAYOUT.logoSize,
    height: SPLASH_LAYOUT.logoSize,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    ...typography.display,
    color: SPLASH_COLORS.text,
    textShadowColor: withAlpha(BRAND.violet, 0.5),
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: spacing.sm,
  },
  subtitle: {
    marginTop: SPLASH_LAYOUT.taglineGap,
    paddingHorizontal: SPLASH_LAYOUT.taglinePaddingX,
    paddingVertical: spacing.sm,
    backgroundColor: withAlpha(BRAND.white, 0.1),
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: withAlpha(BRAND.white, 0.2),
  },
  subtitleText: {
    fontSize: SPLASH_LAYOUT.taglineFontSize,
    color: withAlpha(BRAND.white, 0.8),
    fontWeight: "300",
    letterSpacing: 1,
  },
  shimmer1: {
    position: "absolute",
    left: -50,
    width: 100,
    height: 2,
    backgroundColor: withAlpha(BRAND.white, 0.3),
    transform: [{ rotate: "45deg" }],
  },
  shimmer2: {
    position: "absolute",
    right: -30,
    width: 60,
    height: 1,
    backgroundColor: withAlpha(BRAND.violet, 0.4),
    transform: [{ rotate: "-45deg" }],
  },
});
