import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  changeLanguage,
  getLocale,
  hasTranslation,
  restoreSavedLanguage,
  t,
} from "@/shared/config/i18n";

describe("i18n", () => {
  beforeEach(async () => {
    // El setup ya deja el idioma en español; aquí se vacía lo guardado.
    await AsyncStorage.clear();
  });

  it("traduce en el idioma activo", async () => {
    expect(t("common.cancel")).toBe("Cancelar");

    await changeLanguage("de");

    expect(getLocale()).toBe("de");
    expect(t("common.cancel")).toBe("Abbrechen");
  });

  it("changeLanguage recuerda el idioma (solo el código) en AsyncStorage", async () => {
    await changeLanguage("fr");

    expect(await AsyncStorage.getItem("@settings:language")).toBe("fr");
  });

  it("restoreSavedLanguage aplica el idioma guardado", async () => {
    await AsyncStorage.setItem("@settings:language", "pt");

    await restoreSavedLanguage();

    expect(getLocale()).toBe("pt");
  });

  it("un valor guardado que no es un idioma soportado se ignora", async () => {
    await AsyncStorage.setItem("@settings:language", "klingon");

    await restoreSavedLanguage();

    expect(getLocale()).toBe("es");
  });

  it("hasTranslation distingue textos de claves inexistentes o grupos", () => {
    expect(hasTranslation("errors.byStatus.404")).toBe(true);
    expect(hasTranslation("errors.byStatus.418")).toBe(false);
    expect(hasTranslation("errors.byStatus")).toBe(false);
  });
});
