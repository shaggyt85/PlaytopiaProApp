import { LOCALES, loadDictionary } from "@/shared/locales";
import { NATIVE_STRINGS } from "@/shared/locales/native";

describe("textos nativos", () => {
  it("están en los 6 idiomas, con las mismas claves", () => {
    expect(Object.keys(NATIVE_STRINGS).sort()).toEqual([...LOCALES].sort());
    for (const strings of Object.values(NATIVE_STRINGS)) {
      expect(Object.keys(strings)).toEqual(Object.keys(NATIVE_STRINGS.es));
    }
  });

  it("los permisos de la cámara y de las fotos hablan de la foto de perfil", () => {
    expect(NATIVE_STRINGS.es.NSCameraUsageDescription).toMatch(/foto de perfil/);
    expect(NATIVE_STRINGS.es.NSPhotoLibraryUsageDescription).toMatch(/perfil/);
  });

  it("el permiso de Face ID habla de biometría", () => {
    expect(NATIVE_STRINGS.es.NSFaceIDUsageDescription).toMatch(/biometría/);
  });
});

describe("vocabulario", () => {
  // Se entra con el código del móvil, la huella o Face ID: se dice «biometría».
  const FINGERPRINT = /huella|fingerprint|impressão digital|empremta|fingerabdruck|empreinte/i;

  it.each(LOCALES)("ningún texto en %s habla de huella en lugar de biometría", (locale) => {
    const all = JSON.stringify([loadDictionary(locale), NATIVE_STRINGS[locale]]);
    expect(all).not.toMatch(FINGERPRINT);
  });
});
