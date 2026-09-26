import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Idioma elegido a mano en ajustes. Solo se guarda el código ("es", "en"…),
 * nunca las traducciones, que viven en el bundle.
 */
export interface ILanguageStorage {
  load(): Promise<string | null>;
  save(locale: string): Promise<void>;
}

const LANGUAGE_KEY = "@settings:language";

// AsyncStorage puede fallar (almacenamiento lleno, primer arranque raro). Sin
// idioma guardado la app sigue con el del móvil, así que el fallo no se propaga.
export const languageStorage: ILanguageStorage = {
  async load() {
    try {
      return await AsyncStorage.getItem(LANGUAGE_KEY);
    } catch {
      return null;
    }
  },
  async save(locale) {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, locale);
    } catch {
      // Se queda el idioma solo para esta sesión.
    }
  },
};
