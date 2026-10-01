const { BRAND } = require("./src/shared/config/brand");
const { NATIVE_STRINGS } = require("./src/shared/locales/native");
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
    // El del proyecto de EAS (react_native_pro en expo.dev): EAS exige que coincida.
    slug: "reactnativepro",
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
      infoPlist: {
        // Permite que los textos del sistema (permisos) salgan en el idioma del
        // móvil, desde `locales` más abajo.
        CFBundleAllowMixedLocalizations: true,
        // Sin cifrado propio que declarar: HTTPS y el llavero los pone iOS, y
        // crypto-js solo firma con HMAC el token de registro, que es
        // autenticación. Con esto App Store Connect no pregunta en cada build.
        ITSAppUsesNonExemptEncryption: false,
      },
    },
    // Textos del sistema por idioma (src/shared/locales/native.js).
    locales: Object.fromEntries(
      Object.entries(NATIVE_STRINGS).map(([locale, strings]) => [locale, { ios: strings }]),
    ),
    android: {
      package: IS_DEV
        ? "com.playtopiateam.playtopiapro.dev"
        : "com.playtopiateam.playtopiapro",
      adaptiveIcon: {
        foregroundImage: icon("adaptive-icon"),
        // El fondo de la app, de la misma paleta.
        backgroundColor: BRAND.night,
      },
      predictiveBackGestureEnabled: false,
    },
    plugins: [
      "expo-router",
      [
        "expo-local-authentication",
        // Texto por defecto del permiso de Face ID; las traducciones, en `locales`.
        { faceIDPermission: NATIVE_STRINGS.es.NSFaceIDUsageDescription },
      ],
      [
        "expo-navigation-bar",
        {
          // Con navegación por botones, Android pinta detrás una capa translúcida
          // (blanca con el sistema en claro). Sin ella se ve la app, como en iOS;
          // `dark`: botones claros para el tema oscuro. Expo Go no aplica plugins:
          // solo se ve en un development build o en la de tienda.
          enforceContrast: false,
          style: "dark",
        },
      ],
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
    // OTA con EAS Update (guía §14). Cada perfil de eas.json tiene su canal.
    updates: {
      url: "https://u.expo.dev/7dbed37c-c130-4928-9984-6c691f49d354",
      fallbackToCacheTimeout: 0,
    },
    // `fingerprint`: el runtime cambia en cuanto cambian las dependencias nativas
    // o la configuración nativa, y EAS deja de entregar el update a los binarios
    // que no lo pueden ejecutar. Un cambio nativo obliga a un build nuevo.
    runtimeVersion: {
      policy: "fingerprint",
    },
    extra: {
      eas: {
        projectId: "7dbed37c-c130-4928-9984-6c691f49d354",
      },
    },
    owner: "playtopiateam",
  },
};
