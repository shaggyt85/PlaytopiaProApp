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

// Escala de radios del prototipo de Lovable (base 20).
const radius = { sm: 14, md: 17, lg: 20, xl: 26, xxl: 32, xxxl: 40, pill: 999 } as const;

const typography = {
  /** Nombre de marca grande (splash). */
  display: { fontSize: 32, fontWeight: "700", letterSpacing: 4 },
  /** Nombre de marca en la cabecera de acceso. */
  brand: { fontSize: 32, fontWeight: "700", letterSpacing: 2 },
  title: { fontSize: 24, fontWeight: "700" },
  subtitle: { fontSize: 18, fontWeight: "600" },
  body: { fontSize: 16, fontWeight: "400" },
  /** Cuerpo destacado (p. ej. el email en la pantalla de contraseña). */
  emphasis: { fontSize: 16, fontWeight: "500" },
  caption: { fontSize: 13, fontWeight: "400" },
  /** Texto junto a una casilla (términos, "prefiero no decirlo"). */
  label: { fontSize: 14, fontWeight: "400", lineHeight: 20 },
  /** Texto legal, pies. */
  small: { fontSize: 12, fontWeight: "400" },
  /** Versión de la app. */
  micro: { fontSize: 11, fontWeight: "400", letterSpacing: 1 },
  button: { fontSize: 16, fontWeight: "700" },
  /** Lo que se escribe dentro de un campo. */
  input: { fontSize: 18, fontWeight: "400" },
} as const;

/**
 * Brillo de color bajo un elemento (el `glow-*` de Lovable): la pestaña activa,
 * el botón "Empezar", el logo.
 */
export const glow = (color: string) =>
  ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
  }) as const;

const textGlow = {
  textShadowColor: withAlpha(BRAND.magenta, 0.5),
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
} as const;

export const darkTheme = {
  colors: {
    background: BRAND.night,
    surface: BRAND.surface,
    /** Superficies secundarias (hojas inferiores, capas sobre superficies). */
    surfaceStrong: BRAND.raised,
    card: BRAND.card,
    elevated: BRAND.elevated,
    text: BRAND.white,
    textSecondary: BRAND.mist,
    border: BRAND.line,
    primary: BRAND.magenta,
    onPrimary: BRAND.white,
    accent: BRAND.violet,
    success: BRAND.success,
    warning: BRAND.warning,
    danger: BRAND.danger,
    /** Fondo "cristal" de los campos sobre el fondo de marca. */
    glass: withAlpha(BRAND.white, 0.1),
    glassBorder: withAlpha(BRAND.magenta, 0.3),
    /** Cristal oscuro de paneles flotantes (barra de pestañas). */
    glassPanel: withAlpha(BRAND.ink, 0.72),
    /** Fondo sólido de los campos del formulario de registro. */
    field: BRAND.field,
    /** Opciones de selección de los formularios (género). */
    option: BRAND.purple,
    disabled: BRAND.grey,
    /** Fondo del botón liso cuando no se puede pulsar. */
    inactive: BRAND.line,
    link: BRAND.magenta,
    /** Velo bajo un modal. */
    overlay: withAlpha(BRAND.black, 0.5),
    /** Líneas y bordes finos sobre cristal. */
    hairline: withAlpha(BRAND.white, 0.1),
    hairlineStrong: withAlpha(BRAND.white, 0.25),
    /** Brillo de los elementos de marca. */
    glowPrimary: BRAND.glowMagenta,
  },
  /** Colores de contadores y accesos rápidos (Hoy), cada uno con su degradado. */
  accents: {
    gold: { color: BRAND.gold, gradient: [BRAND.goldFrom, BRAND.goldTo] as const },
    coral: { color: BRAND.coral, gradient: [BRAND.coralFrom, BRAND.coralTo] as const },
    sky: { color: BRAND.sky, gradient: [BRAND.skyFrom, BRAND.skyTo] as const },
    violet: { color: BRAND.purple, gradient: [BRAND.purpleFrom, BRAND.purpleTo] as const },
  },
  gradients: {
    /** Degradado de marca (135°): botón principal, pestaña activa. */
    brand: [BRAND.brandFrom, BRAND.brandVia, BRAND.brandTo] as const,
    /** Tarjetas oscuras. */
    ink: [BRAND.inkFrom, BRAND.inkTo] as const,
    /** Tarjeta de cristal de los modales. */
    modal: [withAlpha(BRAND.night, 0.85), withAlpha(BRAND.inkTo, 0.9)] as const,
    disabled: [BRAND.grey, BRAND.grey] as const,
  },
  /**
   * Resplandores radiales del fondo de marca (los del `body` de Lovable):
   * centro en % de la pantalla y hasta dónde llegan (fracción del radio).
   */
  backdrop: [
    { color: BRAND.backdropMagenta, opacity: 0.35, x: 0, y: -0.1, reach: 0.55 },
    { color: BRAND.backdropViolet, opacity: 0.32, x: 1, y: 0.05, reach: 0.55 },
    { color: BRAND.backdropPlum, opacity: 0.25, x: 0.5, y: 1.1, reach: 0.6 },
  ] as const,
  shadows: { glow: glow(BRAND.glowMagenta), textGlow },
  spacing,
  radius,
  typography,
  /** Área táctil mínima (accesibilidad). */
  touchTarget: 44,
  /** Alto de campos y botones (píldoras). */
  controlHeight: 48,
};

export type Theme = typeof darkTheme;

/**
 * Píldora sólida de los campos del registro (Input `solid`, teléfono): fondo
 * `field` y borde del color primario.
 */
export const solidField = (theme: Theme) =>
  ({
    height: theme.controlHeight,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.field,
  }) as const;
export type ThemeColor = keyof Theme["colors"];
export type TextVariant = keyof Theme["typography"];
