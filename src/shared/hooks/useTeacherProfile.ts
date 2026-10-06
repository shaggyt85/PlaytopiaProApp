import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import {
  teacherProfileQuery,
  teacherProfileService,
  type ITeacherProfileService,
} from "@/shared/services/teacherProfileService";
import { useSessionUserId } from "@/shared/store/sessionStore";

interface Options<T> {
  /** Lo que la pantalla usa del perfil: solo se vuelve a pintar si eso cambia. */
  select?: (profile: TeacherProfile) => T;
  service?: Pick<ITeacherProfileService, "get">;
}

/**
 * Perfil del profesor con la sesión abierta. Tras entrar ya está en la caché
 * (lo deja el acceso): solo se pide al reabrir la app o al cambiar de idioma
 * (lleva los deportes traducidos por Core). Lo usan el inicio y Perfil.
 */
export function useTeacherProfile<T = TeacherProfile>({ select, service = teacherProfileService }: Options<T> = {}) {
  const teacherId = useSessionUserId();
  const { locale } = useTranslation();
  return useQuery({ ...teacherProfileQuery(teacherId, locale, service), select });
}
