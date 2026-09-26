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

export const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 1000,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundCircle1: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
  },
  backgroundCircle2: {
    position: "absolute",
    bottom: -150,
    left: -150,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  content: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  logoContainer: {
    marginBottom: 60,
    shadowColor: SPLASH_COLORS.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  logo: {
    width: 120,
    height: 120,
  },
  textContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: SPLASH_COLORS.text,
    letterSpacing: 4,
    textShadowColor: withAlpha(BRAND.violet, 0.5),
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: withAlpha(BRAND.white, 0.1),
    borderRadius: 20,
    borderWidth: 1,
    borderColor: withAlpha(BRAND.white, 0.2),
  },
  subtitleText: {
    fontSize: 14,
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
