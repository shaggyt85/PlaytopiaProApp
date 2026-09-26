import { skipToken, useQuery } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  teacherKeys,
  teacherProfileService,
  type ITeacherProfileService,
} from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

const NO_TEACHER = -1;

/**
 * Perfil del profesor con la sesión abierta. Tras entrar ya está en la caché
 * (lo deja el acceso): solo se pide al reabrir la app.
 */
export function useTeacherProfile(service: Pick<ITeacherProfileService, "get"> = teacherProfileService) {
  const teacherId = useSessionStore((s) => s.user?.userId);
  return useQuery({
    // Sin sesión no se pide nada (skipToken); la clave no llega a usarse.
    queryKey: teacherKeys.profile(teacherId ?? NO_TEACHER),
    queryFn: teacherId === undefined ? skipToken : () => service.get(teacherId),
    ...CachePolicy.STANDARD,
  });
}
