// La config de Expo con lo que añade Sentry: ids de depuración en el bundle para
// casar cada fallo con su source map.
const { getSentryExpoConfig } = require("@sentry/react-native/metro");

module.exports = getSentryExpoConfig(__dirname);
