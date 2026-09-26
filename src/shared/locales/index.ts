import ca from "./ca";
import de from "./de";
import en from "./en";
import es from "./es";
import fr from "./fr";
import pt from "./pt";

export type { Translations } from "./es";

// Los 6 idiomas son obligatorios (guía §12).
export const dictionaries = { es, en, pt, ca, de, fr };

export type Locale = keyof typeof dictionaries;
