// Textos que muestra el propio sistema operativo, no la app: iOS los lee del
// Info.plist, que se genera al compilar, así que no pueden salir del
// diccionario en tiempo de ejecución. Viven aquí, junto al resto de textos,
// en los 6 idiomas. Es JavaScript plano porque los lee app.config.js (que no
// puede importar TypeScript), igual que shared/config/brand.js.
const NATIVE_STRINGS = Object.freeze({
  es: {
    NSFaceIDUsageDescription:
      "Playtopia Pro usa la biometría para que accedas sin escribir tu contraseña.",
  },
  en: {
    NSFaceIDUsageDescription:
      "Playtopia Pro uses biometrics so you can sign in without typing your password.",
  },
  pt: {
    NSFaceIDUsageDescription:
      "O Playtopia Pro usa a biometria para você entrar sem digitar sua senha.",
  },
  ca: {
    NSFaceIDUsageDescription:
      "Playtopia Pro fa servir la biometria perquè accedeixis sense escriure la contrasenya.",
  },
  de: {
    NSFaceIDUsageDescription:
      "Playtopia Pro nutzt die Biometrie, damit Sie sich ohne Passwort anmelden können.",
  },
  fr: {
    NSFaceIDUsageDescription:
      "Playtopia Pro utilise la biométrie pour que vous vous connectiez sans saisir votre mot de passe.",
  },
});

module.exports = { NATIVE_STRINGS };
