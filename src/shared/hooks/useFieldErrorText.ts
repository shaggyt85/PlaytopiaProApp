import { hasTranslation, i18n } from "@/shared/config/i18n";
import { useTranslation } from "@/shared/hooks/useTranslation";

/**
 * Traduce el mensaje de un error de formulario. Los schemas guardan claves de
 * i18n tipadas (`message()` de `shared/schemas/validationMessage`), así que aquí basta con
 * traducirlas; si no fuera una clave, se muestra tal cual.
 */
export function useFieldErrorText() {
  useTranslation(); // vuelve a pintar al cambiar de idioma
  return (message?: string) =>
    message ? (hasTranslation(message) ? i18n.t(message) : message) : undefined;
}
