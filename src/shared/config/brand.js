// Colores de marca de Playtopia. Única fuente: los usa app.config.js (splash
// nativo) y la app a través de shared/config/theme. Es JavaScript plano porque
// app.config.js no puede importar TypeScript; TypeScript deduce los tipos
// de aquí mismo (allowJs).
const BRAND = Object.freeze({
  night: "#1a1333", // fondo principal
  deep: "#2d1b69", // centro del degradado de marca
  violet: "#7B3FFF", // acento / primario
  pink: "#C21D93", // brillos decorativos
  indigo: "#5742E3", // inicio del degradado de los botones
  purple: "#8033C4", // final del degradado de los botones
  lilac: "#8B5FBF", // opciones de los formularios (género)
  grey: "#9D9D9D", // deshabilitado, bordes neutros
  white: "#FFFFFF",
  black: "#000000", // sombras y fondos translúcidos de modales
  slate: "#0F172A", // final del degradado de las tarjetas de cristal
});

module.exports = { BRAND };
