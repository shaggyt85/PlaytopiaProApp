import type { t as translate } from "@/shared/config/i18n";
import { isHttpError } from "@/shared/services/HttpError";
import { getErrorMessage } from "@/shared/utils/getErrorMessage";

/**
 * El error del paso de la contraseña. En el login, un 401 son credenciales
 * incorrectas (Core no manda un `type` propio). Si el email también es de
 * alumno, se aclara que la contraseña es la de la cuenta de profesor, que es
 * otra. Lo demás, como en toda la app (`getErrorMessage`).
 */
export function passwordErrorText(error: unknown, isStudent: boolean, t: typeof translate): string | null {
  if (!error) return null;
  if (isHttpError(error) && error.status === 401) {
    const base = t("auth.password.invalidCredentials");
    return isStudent ? `${base} ${t("auth.password.studentHint")}` : base;
  }
  return getErrorMessage(error);
}
