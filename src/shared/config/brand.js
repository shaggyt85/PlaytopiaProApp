// Paleta de Playtopia Pro (la del prototipo de Lovable, pasada de OKLCH a hex).
// Única fuente de colores: los usa app.config.js (splash nativo e icono de
// Android) y la app a través de shared/config/theme, que los asigna a usos.
// Ningún componente importa esto: los colores salen del tema.
// Es JavaScript plano porque app.config.js no puede importar TypeScript;
// TypeScript deduce los tipos de aquí mismo (allowJs).
const BRAND = Object.freeze({
  // Fondo y capas, de más oscura a más clara.
  night: "#0C0B1A", // fondo de la app, splash nativo, fondo del icono de Android
  ink: "#10101E", // base del cristal (barra de pestañas)
  surface: "#171628", // superficies
  card: "#19182B", // tarjetas
  elevated: "#1D1C31", // tarjetas elevadas
  raised: "#222137", // superficies secundarias
  field: "#2B2A44", // campos de formulario
  line: "#302F4B", // bordes

  // Marca.
  magenta: "#EF1EC1", // primario
  violet: "#A63DF8", // acento
  brandFrom: "#FF2FB5", // degradado de marca: rosa…
  brandVia: "#C122E0", // …magenta…
  brandTo: "#8434F4", // …violeta
  glowMagenta: "#DD00B1", // brillo de los elementos de marca
  raisedEdge: "#A2007F", // borde de abajo de lo elegido en relieve (btn-3d-lime: oklch(0.45 0.27 340))
  raisedGlow: "#CB00A1", // su brillo (oklch(0.55 0.27 340))

  // Resplandores del fondo.
  backdropMagenta: "#BB0093", // arriba a la izquierda
  backdropViolet: "#6900D1", // arriba a la derecha
  backdropPlum: "#86009E", // abajo

  // Acentos de contadores y accesos rápidos, con su degradado (claro → oscuro).
  gold: "#FF8F3B",
  goldFrom: "#FFA84A",
  goldTo: "#F86F3C",
  coral: "#FF396A",
  coralFrom: "#FF5468",
  coralTo: "#F50069",
  sky: "#00B0FF",
  skyFrom: "#00B9FF",
  skyTo: "#007DF3",
  purple: "#9754FF",
  purpleFrom: "#BF71FF",
  purpleTo: "#6D45F9",

  // Degradado "tinta" de las tarjetas oscuras.
  inkFrom: "#251932",
  inkTo: "#141327",

  // Texto y estados.
  white: "#FFFFFF",
  black: "#000000",
  mist: "#9C9CB1", // texto secundario
  grey: "#9D9D9D", // deshabilitado
  danger: "#F94144",
  success: "#00C851",
  warning: "#FF8800",
});

module.exports = { BRAND };
