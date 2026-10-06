import { useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import { teacherProfileQuery } from "@/shared/services/teacherProfileService";
import { useSessionUserId } from "@/shared/store/sessionStore";

import { profileKeys } from "../services/profileDetailsService";

/** El perfil como queda, o el cambio a hacerle (la foto nueva). */
export type ProfileChange = TeacherProfile | ((current: TeacherProfile) => TeacherProfile);

/**
 * Deja en la caché el perfil como queda tras cambiarlo desde Perfil: el inicio
 * y Perfil lo ven al instante, sin pedirlo otra vez. Invalida los detalles de
 * Perfil, que llevan el mismo perfil dentro. Una sola forma para todo lo que
 * cambia el perfil (sus datos, su foto).
 */
export function useStoreProfile() {
  const queryClient = useQueryClient();
  const teacherId = useSessionUserId();
  const { locale } = useTranslation();
  return (change: ProfileChange) => {
    queryClient.setQueryData(teacherProfileQuery(teacherId, locale).queryKey, (current) =>
      typeof change === "function" ? current && change(current) : change,
    );
    return queryClient.invalidateQueries({ queryKey: profileKeys.allDetails });
  };
}
