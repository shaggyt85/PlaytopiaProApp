import { hasTranslation, i18n, t } from "@/shared/config/i18n";
import { problemKey } from "@/shared/schemas/problemDetail.schema";
import { isHttpError } from "@/shared/services/HttpError";

/**
 * Texto para el usuario a partir de cualquier error (guía §6). Orden:
 * 1. el `type` de Core traducido (errors.byType.<clave>, ver problemKey);
 * 2. el texto genérico de su status (errors.byStatus.<status>, o el de 500
 *    para cualquier 5xx);
 * 3. red, timeout, una respuesta que no cumple el contrato o el genérico.
 *
 * Nunca se muestra el `detail` de Core: es prosa en español para logs.
 */
export function getErrorMessage(error: unknown): string {
  if (!isHttpError(error)) return t("errors.unknown");
  if (error.kind === "network") return t("errors.network");
  if (error.kind === "timeout") return t("errors.timeout");
  if (error.kind === "contract") return t("errors.contract");

  // Estas claves se arman en ejecución: se comprueba que existen y se usa i18n.t.
  const key = problemKey(error.type);
  const byType = key && `errors.byType.${key}`;
  if (byType && hasTranslation(byType)) return i18n.t(byType);

  const status = error.status ?? 0;
  const byStatus = `errors.byStatus.${status >= 500 ? 500 : status}`;
  return hasTranslation(byStatus) ? i18n.t(byStatus) : t("errors.unknown");
}

/** El texto de un error que puede no haberlo: `null` si no lo hay (lo que pinta `FormError`). */
export const errorMessageOrNull = (error: unknown): string | null => (error ? getErrorMessage(error) : null);
