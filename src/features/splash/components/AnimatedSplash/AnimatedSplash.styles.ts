import { StyleSheet } from "react-native";

// Colores de marca del splash. Pasan a los tokens de shared/config/theme
// cuando exista el tema (paso 13).
export const SPLASH_COLORS = {
  gradient: ["#1a1333", "#2d1b69", "#1a1333"] as const,
  glowStrong: [
    "rgba(194, 29, 147, 0.25)",
    "rgba(194, 29, 147, 0.15)",
    "rgba(194, 29, 147, 0.05)",
    "rgba(194, 29, 147, 0)",
  ] as const,
  glowSoft: [
    "rgba(194, 29, 147, 0.20)",
    "rgba(194, 29, 147, 0.12)",
    "rgba(194, 29, 147, 0.04)",
    "rgba(194, 29, 147, 0)",
  ] as const,
  accent: "#7B3FFF",
  text: "#FFFFFF",
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
    textShadowColor: "rgba(123, 63, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  subtitle: {
    marginTop: 12,
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  subtitleText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "300",
    letterSpacing: 1,
  },
  shimmer1: {
    position: "absolute",
    left: -50,
    width: 100,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    transform: [{ rotate: "45deg" }],
  },
  shimmer2: {
    position: "absolute",
    right: -30,
    width: 60,
    height: 1,
    backgroundColor: "rgba(123, 63, 255, 0.4)",
    transform: [{ rotate: "-45deg" }],
  },
});
