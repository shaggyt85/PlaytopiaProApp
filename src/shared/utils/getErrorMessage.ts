import { hasTranslation, i18n, t } from "@/shared/config/i18n";
import { isHttpError } from "@/shared/services/HttpError";

const PROBLEM_TYPE_PREFIX = "urn:playtopia:problem:";

/**
 * Texto para el usuario a partir de cualquier error (guía §6). Orden:
 * 1. el `type` de Core traducido (errors.byType.<clave>);
 * 2. el texto genérico de su status (errors.byStatus.<status>, o el de 500
 *    para cualquier 5xx);
 * 3. red, timeout o el genérico.
 *
 * Nunca se muestra el `detail` de Core: es prosa en español para logs.
 */
export function getErrorMessage(error: unknown): string {
  if (!isHttpError(error)) return t("errors.unknown");
  if (error.kind === "network") return t("errors.network");
  if (error.kind === "timeout") return t("errors.timeout");

  // Estas claves se arman en ejecución: se comprueba que existen y se usa i18n.t.
  if (error.type?.startsWith(PROBLEM_TYPE_PREFIX)) {
    const byType = `errors.byType.${error.type.slice(PROBLEM_TYPE_PREFIX.length)}`;
    if (hasTranslation(byType)) return i18n.t(byType);
  }

  const status = error.status ?? 0;
  const byStatus = `errors.byStatus.${status >= 500 ? 500 : status}`;
  return hasTranslation(byStatus) ? i18n.t(byStatus) : t("errors.unknown");
}

