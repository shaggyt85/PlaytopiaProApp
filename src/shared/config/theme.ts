import { withAlpha } from "@/shared/utils/color";

import { BRAND } from "./brand";
import { FONTS } from "./fonts";

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

// Cada variante lleva su fuente (el peso va en el nombre, ver fonts.ts) y
// nunca `fontWeight`. Títulos y marca en Sora; el resto en Inter.
const typography = {
  /** Nombre de marca grande (splash). */
  display: { fontFamily: FONTS.display, fontSize: 32, letterSpacing: 4 },
  /** Nombre de marca en la cabecera de acceso. */
  brand: { fontFamily: FONTS.displayHeavy, fontSize: 32, letterSpacing: 2 },
  /** Marca pequeña junto al logo, arriba de cada pestaña ("PLAYTOPIA"). */
  wordmark: { fontFamily: FONTS.displayHeavy, fontSize: 14, letterSpacing: 3 },
  /** Nombre grande de una cabecera (el del profesor en Hoy). */
  hero: { fontFamily: FONTS.display, fontSize: 30, lineHeight: 36 },
  title: { fontFamily: FONTS.display, fontSize: 24 },
  subtitle: { fontFamily: FONTS.display, fontSize: 18 },
  body: { fontFamily: FONTS.regular, fontSize: 16 },
  /** Cuerpo destacado (p. ej. el email en la pantalla de contraseña). */
  emphasis: { fontFamily: FONTS.medium, fontSize: 16 },
  /** Dato corto remarcado (p. ej. el prefijo de un teléfono). */
  strong: { fontFamily: FONTS.semibold, fontSize: 16 },
  caption: { fontFamily: FONTS.regular, fontSize: 13 },
  /** Línea pequeña en mayúsculas sobre un título (el saludo de Hoy). */
  eyebrow: { fontFamily: FONTS.medium, fontSize: 12, letterSpacing: 2.2, textTransform: "uppercase" },
  /** Texto secundario de 14: junto a una casilla (términos, "prefiero no decirlo") o subtítulo de una cabecera. */
  label: { fontFamily: FONTS.regular, fontSize: 14, lineHeight: 20 },
  /** Texto legal, pies. */
  small: { fontFamily: FONTS.regular, fontSize: 12 },
  /** Marca pequeña dentro de un control (el ✓ de una casilla). */
  mark: { fontFamily: FONTS.bold, fontSize: 12 },
  /** Versión de la app. */
  micro: { fontFamily: FONTS.regular, fontSize: 11, letterSpacing: 1 },
  /** Nombre de una pestaña del menú inferior. */
  tab: { fontFamily: FONTS.semibold, fontSize: 10, letterSpacing: 0.4 },
  // Escala del texto de las tarjetas del prototipo, la más usada en él:
  // `font-display text-base` (23 veces), `text-[10px]` (183) y `text-[11px]` (115).
  /** Título de una tarjeta (el nombre de una sede, de una clase). */
  cardTitle: { fontFamily: FONTS.display, fontSize: 16, lineHeight: 20 },
  /** Chip sobre un título (la sede, «Urgente»): mayúsculas algo espaciadas. */
  chip: { fontFamily: FONTS.bold, fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase" },
  /** Línea de datos bajo un título (ciudad y dirección, día y hora). */
  meta: { fontFamily: FONTS.regular, fontSize: 11 },
  /** Lema bajo la marca (splash). */
  tagline: { fontFamily: FONTS.regular, fontSize: 14, letterSpacing: 1 },
  button: { fontFamily: FONTS.bold, fontSize: 16 },
  /** Botón con aspecto de enlace ("¿Has olvidado tu contraseña?"). */
  link: { fontFamily: FONTS.regular, fontSize: 15 },
  /** Lo que se escribe dentro de un campo. */
  input: { fontFamily: FONTS.regular, fontSize: 18 },
} as const;

/**
 * Brillo de color bajo un elemento (el `glow-*` de Lovable): la pestaña activa,
 * el botón "Empezar", el logo. Lovable usa `0 10px 30px -8px` al 70 %; React
 * Native no tiene el `-8px` (spread) que encoge la sombra, así que se aproxima
 * con menos desplazamiento, radio y opacidad.
 */
export const glow = (color: string) =>
  ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 6,
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
    /** Velo bajo un panel inferior (va además desenfocado). */
    sheetOverlay: withAlpha(BRAND.black, 0.6),
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
    /**
     * Velo de una tarjeta con foto de fondo, de izquierda a derecha: opaco donde
     * va el texto (para que se lea como en el `bg-surface` de Lovable) y dejando
     * ver la foto a la derecha.
     */
    imageVeil: [BRAND.surface, withAlpha(BRAND.surface, 0.85), withAlpha(BRAND.surface, 0.3)] as const,
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
  /** Margen lateral de pantallas y paneles (el `px-5` de Lovable). */
  gutter: 20,
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
