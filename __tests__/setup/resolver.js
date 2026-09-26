// Resolver de Jest: el de react-native-worklets encadenado con el de React
// Native que ya trae jest-expo.
// - worklets: en Jest no hay módulo nativo, así que sus ficheros se resuelven
//   sin las extensiones `.native` (lo exige Reanimated 4 en los tests).
// - React Native: el de @react-native/jest-preset, que jest-expo usa por defecto.
const reactNativeResolver = require("@react-native/jest-preset/jest/resolver");
const workletsResolver = require("react-native-worklets/jest/resolver");

module.exports = (request, options) =>
  workletsResolver(request, {
    ...options,
    defaultResolver: (path, workletOptions) =>
      reactNativeResolver(path, { ...workletOptions, defaultResolver: options.defaultResolver }),
  });
