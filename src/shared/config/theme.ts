import type { TextStyle } from "react-native";

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

/** Cifras de ancho fijo (el `num` de Lovable): las horas no bailan al cambiar. Fuera del `as const`: `StyleSheet` pide una lista normal. */
const TABULAR_NUMS: TextStyle["fontVariant"] = ["tabular-nums"];

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
  /** Texto pequeño dentro de un control: el ✓ de una casilla, una pestaña (el `text-[12px] font-bold` de Lovable). */
  mark: { fontFamily: FONTS.bold, fontSize: 12 },
  /** Opción de un selector pequeño (DÍA · SEMANA · MES): `text-[11px] font-bold uppercase tracking-wide`. */
  segment: { fontFamily: FONTS.bold, fontSize: 11, letterSpacing: 0.3, textTransform: "uppercase" },
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
  /** Un dato remarcado dentro de esa línea (el día en «Filtrado por **martes 19**»). */
  metaStrong: { fontFamily: FONTS.semibold, fontSize: 11 },
  /**
   * Marca diminuta dentro de una tarjeta pequeña (el club de una clase de la
   * agenda, «PRÓXIMA», la hora de la línea de ahora): el `text-[9px] font-bold`
   * del prototipo, que lo usa 27 veces.
   */
  badge: { fontFamily: FONTS.bold, fontSize: 9, letterSpacing: 0.5, textTransform: "uppercase" },
  /** Título de una fila de clase en Semana y Mes (`text-sm font-bold`). */
  rowTitle: { fontFamily: FONTS.bold, fontSize: 14 },
  /** La hora en el cuadrado de una fila (`text-[11px] font-bold`), con cifras de ancho fijo. */
  timeBadge: { fontFamily: FONTS.bold, fontSize: 11, fontVariant: TABULAR_NUMS },
  /** Marca diminuta en mayúsculas sobre una fila («EN VIVO»: `text-[9px] font-bold uppercase`). */
  statusBadge: { fontFamily: FONTS.bold, fontSize: 9, textTransform: "uppercase" },
  /** Título pequeño (`font-display text-sm font-bold`): una cifra del detalle («2/4»), el nombre de su club. */
  smallTitle: { fontFamily: FONTS.display, fontSize: 14 },
  /** Lo que es esa cifra («Alumnos»): `text-[10px]`. */
  statLabel: { fontFamily: FONTS.regular, fontSize: 10 },
  /**
   * Una cifra del día encima de la agenda («6», «5:50 h»): `font-display text-xl num`. Sin el
   * `leading-none` del prototipo: con `lineHeight` igual al tamaño, iOS sube los números de Sora
   * y el icono de al lado queda bajo; con la altura natural quedan centrados con él.
   */
  statValue: { fontFamily: FONTS.display, fontSize: 20, fontVariant: TABULAR_NUMS },
  /** Un dato remarcado de 12 (el club en la cabecera del detalle: `text-xs font-semibold`). */
  labelStrong: { fontFamily: FONTS.semibold, fontSize: 12 },
  /** Iniciales en el círculo de un alumno (`font-display font-bold text-[10px]` del `CoachAvatar` pequeño). */
  avatarInitials: { fontFamily: FONTS.display, fontSize: 10 },
  /** Iniciales en el círculo mediano (el `CoachAvatar md` de la lista de alumnos: `text-xs`). */
  avatarInitialsMd: { fontFamily: FONTS.display, fontSize: 12 },
  /** El nombre en una fila de lista (un alumno: `text-sm font-semibold`). */
  rowLabel: { fontFamily: FONTS.semibold, fontSize: 14 },
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

/**
 * Resplandor alrededor de un elemento, sin desplazamiento (el
 * `shadow-[0_0_12px_var(--coral)]` de Lovable): la línea de «ahora» de la
 * agenda. Con `spread` negativo se encoge (el `0_0_20px_-6px` del avatar del
 * profesor). Con `boxShadow`, que React Native pinta igual en iOS y Android.
 */
export const halo = (color: string, blur = 12, spread = 0) =>
  ({ boxShadow: `0 0 ${blur}px ${spread}px ${color}` }) as const;

/** Sombra de algo que flota sobre el contenido (el `shadow-lg` de Tailwind): la hora de la línea de «ahora». */
const lifted = {
  boxShadow: `0 10px 15px -3px ${withAlpha(BRAND.black, 0.1)}, 0 4px 6px -4px ${withAlpha(BRAND.black, 0.1)}`,
} as const;

/**
 * Lo elegido en relieve (el `btn-3d-lime` de Lovable): un borde oscuro de 4
 * debajo y el brillo de marca. La pestaña activa del selector de la agenda y el
 * día elegido de la semana y del mes.
 */
const raised = {
  boxShadow: `0 4px 0 0 ${BRAND.raisedEdge}, 0 8px 22px -4px ${withAlpha(BRAND.raisedGlow, 0.6)}`,
} as const;

const textGlow = {
  textShadowColor: withAlpha(BRAND.magenta, 0.5),
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 8,
} as const;

/** Degradado de marca (135°): botón principal, pestaña activa. */
const brandGradient = [BRAND.brandFrom, BRAND.brandVia, BRAND.brandTo] as const;

/** Colores de contadores y accesos rápidos (Hoy), cada uno con su degradado. */
const accents = {
  gold: { color: BRAND.gold, gradient: [BRAND.goldFrom, BRAND.goldTo] as const },
  coral: { color: BRAND.coral, gradient: [BRAND.coralFrom, BRAND.coralTo] as const },
  sky: { color: BRAND.sky, gradient: [BRAND.skyFrom, BRAND.skyTo] as const },
  violet: { color: BRAND.purple, gradient: [BRAND.purpleFrom, BRAND.purpleTo] as const },
} as const;

/** Líneas y bordes finos sobre cristal. */
const hairline = withAlpha(BRAND.white, 0.1);

/**
 * El `ring-soft` del prototipo (una sombra interior que React Native no tiene),
 * aproximado con un borde fino: el de casi todas las tarjetas, filas y paneles.
 * Cada uno pone su fondo y su radio.
 */
const ringSoft = { borderWidth: 1, borderColor: hairline } as const;

/** Un color con su degradado: el de un acento o el de un club. */
export type ColorPair = { color: string; gradient: readonly [string, string, ...string[]] };

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
    hairline,
    hairlineStrong: withAlpha(BRAND.white, 0.25),
    /** Brillo de los elementos de marca. */
    glowPrimary: BRAND.glowMagenta,
  },
  accents,
  /**
   * El color de cada club en la agenda (chips y tarjetas), por su posición en
   * «Mis clubes» y en ciclo: marca, violeta, azul, coral y oro. Son los mismos
   * colores del tema, no otros: así cinco clubes nunca repiten color.
   */
  clubColors: [
    { color: BRAND.magenta, gradient: brandGradient },
    accents.violet,
    accents.sky,
    accents.coral,
    accents.gold,
  ] as const satisfies readonly ColorPair[],
  /** El de una sede que ya no está en «Mis clubes» (acaban de darle de baja). */
  clubColorUnknown: { color: BRAND.grey, gradient: [BRAND.grey, BRAND.grey] as const } satisfies ColorPair,
  gradients: {
    /** Degradado de marca (135°): botón principal, pestaña activa. */
    brand: brandGradient,
    /**
     * La tarjeta de la próxima clase, sobre `surface`: un toque magenta arriba a la
     * izquierda y violeta abajo a la derecha (el `color-mix` al 16 % y al 14 % del
     * prototipo), con `surface` limpia en medio (paradas en `NEXT_CLASS_STOPS`).
     */
    nextClass: [withAlpha(BRAND.magenta, 0.16), withAlpha(BRAND.surface, 0), withAlpha(BRAND.violet, 0.14)] as const,
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
  shadows: { glow: glow(BRAND.glowMagenta), textGlow, lifted, raised },
  spacing,
  radius,
  typography,
  /** Margen lateral de pantallas y paneles (el `px-5` de Lovable). */
  gutter: 20,
  /** Área táctil mínima (accesibilidad). */
  touchTarget: 44,
  /** Alto de campos y botones (píldoras). */
  controlHeight: 48,
  ringSoft,
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
