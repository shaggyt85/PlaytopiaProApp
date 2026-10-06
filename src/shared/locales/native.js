// Textos que muestra el propio sistema operativo, no la app: iOS los lee del
// Info.plist, que se genera al compilar, así que no pueden salir del
// diccionario en tiempo de ejecución. Viven aquí, junto al resto de textos,
// en los 6 idiomas. Es JavaScript plano porque los lee app.config.js (que no
// puede importar TypeScript), igual que shared/config/brand.js.
const NATIVE_STRINGS = Object.freeze({
  es: {
    NSFaceIDUsageDescription:
      "Playtopia Pro usa la biometría para que accedas sin escribir tu contraseña.",
    NSCameraUsageDescription:
      "Playtopia Pro usa la cámara para que te hagas la foto de perfil.",
    NSPhotoLibraryUsageDescription:
      "Playtopia Pro accede a tus fotos para que elijas la de tu perfil.",
  },
  en: {
    NSFaceIDUsageDescription:
      "Playtopia Pro uses biometrics so you can sign in without typing your password.",
    NSCameraUsageDescription:
      "Playtopia Pro uses the camera so you can take your profile photo.",
    NSPhotoLibraryUsageDescription:
      "Playtopia Pro accesses your photos so you can choose your profile photo.",
  },
  pt: {
    NSFaceIDUsageDescription:
      "O Playtopia Pro usa a biometria para você entrar sem digitar sua senha.",
    NSCameraUsageDescription:
      "O Playtopia Pro usa a câmara para você tirar a sua foto de perfil.",
    NSPhotoLibraryUsageDescription:
      "O Playtopia Pro acede às suas fotos para você escolher a do seu perfil.",
  },
  ca: {
    NSFaceIDUsageDescription:
      "Playtopia Pro fa servir la biometria perquè accedeixis sense escriure la contrasenya.",
    NSCameraUsageDescription:
      "Playtopia Pro fa servir la càmera perquè et facis la foto de perfil.",
    NSPhotoLibraryUsageDescription:
      "Playtopia Pro accedeix a les teves fotos perquè triïs la del teu perfil.",
  },
  de: {
    NSFaceIDUsageDescription:
      "Playtopia Pro nutzt die Biometrie, damit Sie sich ohne Passwort anmelden können.",
    NSCameraUsageDescription:
      "Playtopia Pro nutzt die Kamera, damit Sie Ihr Profilfoto aufnehmen können.",
    NSPhotoLibraryUsageDescription:
      "Playtopia Pro greift auf Ihre Fotos zu, damit Sie Ihr Profilfoto auswählen können.",
  },
  fr: {
    NSFaceIDUsageDescription:
      "Playtopia Pro utilise la biométrie pour que vous vous connectiez sans saisir votre mot de passe.",
    NSCameraUsageDescription:
      "Playtopia Pro utilise l'appareil photo pour que vous preniez votre photo de profil.",
    NSPhotoLibraryUsageDescription:
      "Playtopia Pro accède à vos photos pour que vous choisissiez celle de votre profil.",
  },
});

module.exports = { NATIVE_STRINGS };
