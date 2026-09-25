// Identidad de la app. APP_VARIANT=development genera la variante DEV, que se
// instala junto a la de tienda sin pisarla (bundle id y package distintos).
//
// bundleIdentifier y package no se pueden cambiar una vez publicada la app.
//
// La versión (SemVer) se cambia a mano aquí y en package.json. versionCode y
// buildNumber no se escriben: los sube EAS (ver docs/GUIA_APP_PROFESOR.md §14).
const IS_DEV = process.env.APP_VARIANT === "development";

export default {
  expo: {
    name: IS_DEV ? "Playtopia Pro DEV" : "Playtopia Pro",
    slug: "playtopia-app-pro",
    version: "1.0.0",
    scheme: IS_DEV ? "playtopia-pro-dev" : "playtopia-pro",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    platforms: ["ios", "android"],
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: false,
      bundleIdentifier: IS_DEV
        ? "com.playtopiateam.playtopiapro.dev"
        : "com.playtopiateam.playtopiapro",
    },
    android: {
      package: IS_DEV
        ? "com.playtopiateam.playtopiapro.dev"
        : "com.playtopiateam.playtopiapro",
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    plugins: ["expo-router"],
  },
};
