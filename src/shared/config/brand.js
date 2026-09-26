// Colores de marca de Playtopia. Única fuente: los usa app.config.js (splash
// nativo) y la app a través de shared/config/theme. Es JavaScript plano porque
// app.config.js no puede importar TypeScript; los tipos están en brand.d.ts.
const BRAND = Object.freeze({
  night: "#1a1333", // fondo principal
  deep: "#2d1b69", // centro del degradado de marca
  violet: "#7B3FFF", // acento / primario
  pink: "#C21D93", // brillos decorativos
  white: "#FFFFFF",
});

module.exports = { BRAND };
