// Identidad de la app. APP_VARIANT=development genera la variante DEV, que se
// instala junto a la de tienda sin pisarla (bundle id, package e icono propios).
//
// bundleIdentifier y package no se pueden cambiar una vez publicada la app.
//
// La versión (SemVer) se cambia a mano aquí y en package.json. versionCode y
// buildNumber no se escriben: los sube EAS (ver docs/GUIA_APP_PROFESOR.md §14).
const IS_DEV = process.env.APP_VARIANT === "development";

// Iconos de Playtopia; la variante DEV lleva su versión -dev para distinguirlas.
const icon = (nombre) =>
  `./assets/app_icons/${nombre}${IS_DEV ? "-dev" : ""}.png`;

// Color de marca del splash (mismo en claro y oscuro).
const SPLASH_BACKGROUND = "#1a1333";

export default {
  expo: {
    name: IS_DEV ? "Playtopia Pro DEV" : "Playtopia Pro",
    slug: "playtopia-app-pro",
    version: "1.0.0",
    scheme: IS_DEV ? "playtopia-pro-dev" : "playtopia-pro",
    orientation: "portrait",
    icon: icon("ios-light"),
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    platforms: ["ios", "android"],
    ios: {
      supportsTablet: false,
      bundleIdentifier: IS_DEV
        ? "com.playtopiateam.playtopiapro.dev"
        : "com.playtopiateam.playtopiapro",
      // iOS elige el icono según el tema del sistema.
      icon: {
        light: icon("ios-light"),
        dark: icon("ios-dark"),
        tinted: icon("ios-tinted"),
      },
    },
    android: {
      package: IS_DEV
        ? "com.playtopiateam.playtopiapro.dev"
        : "com.playtopiateam.playtopiapro",
      adaptiveIcon: {
        foregroundImage: icon("adaptive-icon"),
        backgroundColor: "#000000",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: SPLASH_BACKGROUND,
          image: "./assets/app_icons/splash-icon-light.png",
          dark: {
            backgroundColor: SPLASH_BACKGROUND,
            image: "./assets/app_icons/splash-icon-dark.png",
          },
          imageWidth: 200,
        },
      ],
    ],
  },
};
