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
  /** Nombre de marca grande (splash). */
  display: { fontSize: 32, fontWeight: "700", letterSpacing: 4 },
  /** Nombre de marca en la cabecera de acceso. */
  brand: { fontSize: 32, fontWeight: "700", letterSpacing: 2 },
  /** Subtítulo grande (p. ej. "¡Hola de nuevo!"). */
  heading: { fontSize: 28, fontWeight: "700" },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 18, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  /** Cuerpo destacado (p. ej. el email en la pantalla de contraseña). */
  emphasis: { fontSize: 16, fontWeight: "500" },
  caption: { fontSize: 13, fontWeight: "400" },
  /** Texto legal, pies. */
  small: { fontSize: 12, fontWeight: "400" },
  /** Versión de la app. */
  micro: { fontSize: 11, fontWeight: "400", letterSpacing: 1 },
  button: { fontSize: 16, fontWeight: "700" },
  /** Lo que se escribe dentro de un campo. */
  input: { fontSize: 18, fontWeight: "400" },
} as const;

/** Brillo violeta de marca (logo, títulos de marca). */
const glow = {
  shadowColor: BRAND.violet,
  shadowOffset: { width: 0, height: 8 },
  shadowOpacity: 0.3,
  shadowRadius: 16,
  elevation: 10,
} as const;

const textGlow = {
  textShadowColor: withAlpha(BRAND.violet, 0.5),
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
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
    /** Fondo "cristal" de los campos sobre el fondo de marca. */
    glass: withAlpha(BRAND.white, 0.1),
    glassBorder: withAlpha(BRAND.pink, 0.3),
    disabled: BRAND.grey,
    link: BRAND.violet,
  },
  gradients: {
    brand: [BRAND.night, BRAND.deep, BRAND.night] as const,
    button: [BRAND.indigo, BRAND.purple] as const,
    disabled: [BRAND.grey, BRAND.grey] as const,
  },
  shadows: { glow, textGlow },
  spacing,
  radius,
  typography,
  /** Área táctil mínima (accesibilidad). */
  touchTarget: 44,
};

export type Theme = typeof darkTheme;
export type ThemeColor = keyof Theme["colors"];
export type TextVariant = keyof Theme["typography"];
