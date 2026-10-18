import { useTeacherProfile } from "@/shared/hooks/useTeacherProfile";
import { useSessionUserId } from "@/shared/store/sessionStore";

import { hasCurrentTerms } from "../utils/terms";

import { useAcceptTerms, type AcceptTermsOptions } from "./useAcceptTerms";

/**
 * Los términos con la sesión ya abierta, el caso de uso entero, como en la app
 * de alumnos. Al entrar los mira `completeSignIn`; pero cuando cambian, quien
 * tenía la sesión abierta no vuelve a entrar (actualizar la app no la cierra)
 * y no los vería nunca. Por eso se miran también al abrir la app y al volver a
 * ella (el perfil va en `LIVE`), sin bloquear nada: `pending` si no son los
 * vigentes. Aceptar los deja al día; rechazarlos cierra la sesión. Si no se
 * puede leer el perfil, no están pendientes: se volverá a mirar.
 */
export function useOpenSessionTerms(options?: AcceptTermsOptions) {
  const teacherId = useSessionUserId();
  const { data: termsVersion } = useTeacherProfile({ select: (profile) => profile.terms_version });
  const { accept, reject, error } = useAcceptTerms(options);
  const pending =
    teacherId !== undefined && termsVersion !== undefined && !hasCurrentTerms({ terms_version: termsVersion });

  const acceptCurrent = async () => {
    if (teacherId !== undefined) await accept(teacherId);
  };

  return { pending, acceptCurrent, reject, error };
}
