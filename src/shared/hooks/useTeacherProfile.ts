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
 * (lo deja el acceso): se pide al reabrir la app, al volver a ella pasados
 * 30 s (`LIVE`: así se ven los términos nuevos con la sesión abierta) o al
 * cambiar de idioma (lleva los deportes traducidos por Core). Lo usan el
 * inicio, Perfil y los términos con la sesión abierta.
 */
export function useTeacherProfile<T = TeacherProfile>({ select, service = teacherProfileService }: Options<T> = {}) {
  const teacherId = useSessionUserId();
  const { locale } = useTranslation();
  return useQuery({ ...teacherProfileQuery(teacherId, locale, service), select });
}
