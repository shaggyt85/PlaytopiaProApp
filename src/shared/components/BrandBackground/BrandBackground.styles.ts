import { StyleSheet } from "react-native";

import { BRAND } from "@/shared/config/brand";
import { withAlpha } from "@/shared/utils/color";

// El fondo de marca de Playtopia (splash y pantallas de acceso): degradado,
// dos brillos rosas en esquinas opuestas y dos líneas finas en diagonal.
const glow = (alphas: readonly number[]) =>
  alphas.map((alpha) => withAlpha(BRAND.pink, alpha)) as [string, string, ...string[]];

export const GLOWS = {
  strong: glow([0.25, 0.15, 0.05, 0]),
  soft: glow([0.2, 0.12, 0.04, 0]),
  locations: [0, 0.3, 0.7, 1] as const,
};

const CIRCLE_SMALL = 300;
const CIRCLE_LARGE = 400;

/** Círculo: ancho, alto y radio salen de un solo tamaño. */
const circle = (size: number) => ({
  position: "absolute" as const,
  width: size,
  height: size,
  borderRadius: size / 2,
});

export const styles = StyleSheet.create({
  container: { flex: 1 },
  circleTopRight: {
    ...circle(CIRCLE_SMALL),
    top: -CIRCLE_SMALL / 3,
    right: -CIRCLE_SMALL / 3,
  },
  circleBottomLeft: {
    ...circle(CIRCLE_LARGE),
    bottom: -CIRCLE_LARGE * 0.375,
    left: -CIRCLE_LARGE * 0.375,
  },
  shimmerTop: {
    position: "absolute",
    left: -50,
    width: 100,
    height: 2,
    backgroundColor: withAlpha(BRAND.white, 0.3),
    transform: [{ rotate: "45deg" }],
  },
  shimmerBottom: {
    position: "absolute",
    right: -30,
    width: 60,
    height: 1,
    backgroundColor: withAlpha(BRAND.violet, 0.4),
    transform: [{ rotate: "-45deg" }],
  },
});
