import { useQuery } from "@tanstack/react-query";

import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import {
  teacherProfileQuery,
  teacherProfileService,
  type ITeacherProfileService,
} from "@/shared/services/teacherProfileService";
import { useSessionStore } from "@/shared/store/sessionStore";

interface Options<T> {
  /** Lo que la pantalla usa del perfil: solo se vuelve a pintar si eso cambia. */
  select?: (profile: TeacherProfile) => T;
  service?: Pick<ITeacherProfileService, "get">;
}

/**
 * Perfil del profesor con la sesión abierta. Tras entrar ya está en la caché
 * (lo deja el acceso): solo se pide al reabrir la app.
 */
export function useTeacherProfile<T = TeacherProfile>({ select, service = teacherProfileService }: Options<T> = {}) {
  const teacherId = useSessionStore((s) => s.user?.userId);
  return useQuery({ ...teacherProfileQuery(teacherId, service), select });
}
