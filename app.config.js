const { BRAND } = require("./src/shared/config/brand");
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

// Color de marca del splash, desde la única fuente de colores de marca.
const SPLASH_BACKGROUND = BRAND.night;

export default {
  expo: {
    name: IS_DEV ? "Playtopia Pro DEV" : "Playtopia Pro",
    slug: "playtopia-app-pro",
    version: "1.0.0",
    scheme: IS_DEV ? "playtopia-pro-dev" : "playtopia-pro",
    // Vertical en móvil. En tablets y plegables Android 16 (targetSdk 36) ignora
    // el bloqueo: las pantallas se diseñan responsive (guía §13).
    orientation: "portrait",
    icon: icon("ios-light"),
    // Por ahora solo hay tema oscuro: el claro no está definido (guía §13).
    userInterfaceStyle: "dark",
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
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          // Solo el fondo de marca: el logo lo pone el splash animado
          // (features/splash), que arranca encima sin salto. La imagen es
          // transparente porque, sin imagen, Android 12+ pinta el icono de la app.
          backgroundColor: SPLASH_BACKGROUND,
          image: "./assets/app_icons/splash-transparent.png",
          dark: {
            backgroundColor: SPLASH_BACKGROUND,
            image: "./assets/app_icons/splash-transparent.png",
          },
          imageWidth: 200,
        },
      ],
      [
        "expo-build-properties",
        {
          // R8 en release: ofusca y elimina código y recursos sin usar. Google Play
          // lo exige (optimización DEX). Si una librería nativa se rompe en
          // release, sus reglas van en android.extraProguardRules.
          //
          // minSdk, targetSdk, compileSdk y el mínimo de iOS no se fijan aquí:
          // se usan los del SDK para que se actualicen al subir de versión.
          android: {
            enableMinifyInReleaseBuilds: true,
            enableShrinkResourcesInReleaseBuilds: true,
          },
        },
      ],
    ],
  },
};
