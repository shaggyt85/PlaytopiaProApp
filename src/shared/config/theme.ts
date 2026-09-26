import { withAlpha } from "@/shared/utils/color";

import { BRAND } from "./brand";

/**
 * Tokens de diseño (guía §13). En los componentes no se escriben colores ni
 * tamaños a mano: salen de aquí vía `useTheme()` / `makeStyles()`.
 *
 * Los colores se nombran por su uso (`background`, `danger`…), no por su tono,
 * para que el tema claro, cuando se defina, solo cambie los valores.
 */

const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 } as const;

const radius = { sm: 8, md: 12, lg: 20, pill: 999 } as const;

const typography = {
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 18, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  caption: { fontSize: 13, fontWeight: "400" },
  button: { fontSize: 16, fontWeight: "600" },
} as const;

export const darkTheme = {
  colors: {
    background: BRAND.night,
    surface: "#2d2654",
    surfaceStrong: BRAND.deep,
    text: BRAND.white,
    textSecondary: "#adb5bd",
    border: "#495057",
    primary: BRAND.violet,
    onPrimary: BRAND.white,
    accent: BRAND.pink,
    success: "#00C851",
    warning: "#FF8800",
    danger: "#FF4444",
    overlay: withAlpha(BRAND.white, 0.1),
  },
  gradients: {
    brand: [BRAND.night, BRAND.deep, BRAND.night] as const,
  },
  spacing,
  radius,
  typography,
  /** Área táctil mínima (accesibilidad). */
  touchTarget: 44,
};

export type Theme = typeof darkTheme;
export type ThemeColor = keyof Theme["colors"];
export type TextVariant = keyof Theme["typography"];
