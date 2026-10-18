import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { session, type ISessionService } from "@/shared/services/session";
import {
  teacherProfileQuery,
  teacherProfileService,
  type ITeacherProfileService,
} from "@/shared/services/teacherProfileService";
import { ignoreRejection } from "@/shared/utils/ignoreRejection";

import { TERMS_VERSION } from "../config/terms";

export interface AcceptTermsOptions {
  service?: Pick<ITeacherProfileService, "update">;
  sessionService?: Pick<ISessionService, "end">;
}

/**
 * Lo que comparten los casos de los términos, como en la app de alumnos:
 * aceptar la versión vigente (Core sella la fecha) o cerrarlos sin aceptar. El
 * perfil que devuelve Core queda en la caché para el inicio. Cerrarlos sin
 * aceptar olvida el error y termina la sesión (o borra los tokens del acceso
 * que aún no la abrió). Qué pasa tras aceptar lo decide quien lo usa.
 */
export function useAcceptTerms({ service = teacherProfileService, sessionService = session }: AcceptTermsOptions = {}) {
  const queryClient = useQueryClient();
  const { locale } = useTranslation();
  const mutation = useMutation({
    mutationFn: (teacherId: number) => service.update(teacherId, { terms_version: TERMS_VERSION }),
    onSuccess: (profile, teacherId) =>
      queryClient.setQueryData(teacherProfileQuery(teacherId, locale).queryKey, profile),
  });

  /** `true` si Core los aceptó; si no, el error queda en `error`. */
  const accept = async (teacherId: number) => (await ignoreRejection(mutation.mutateAsync(teacherId))) !== undefined;

  const reject = () => {
    mutation.reset();
    void sessionService.end();
  };

  return { accept, reject, error: mutation.error };
}
