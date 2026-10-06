import type { TranslationKey } from "@/shared/locales";

/**
 * El mensaje de una regla de validación: una clave de i18n tipada (una clave
 * que no existe no compila). El formulario la traduce al mostrarla
 * (`useFieldErrorText`). La usan todos los schemas de formulario.
 */
export const message = (key: TranslationKey) => ({ error: key });
