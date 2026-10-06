import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfileChanges } from "@/shared/schemas/teacherProfile.schema";
import {
  teacherProfileQuery,
  teacherProfileService,
  type ITeacherProfileService,
} from "@/shared/services/teacherProfileService";
import { useSessionUserId } from "@/shared/store/sessionStore";

import { profileKeys } from "../services/profileDetailsService";

/**
 * Guarda cambios del perfil del profesor con la sesión abierta. Core devuelve
 * el perfil como queda: se deja en la caché (el inicio y Perfil lo ven al
 * instante, sin pedirlo otra vez) y se invalidan los detalles de Perfil, que
 * llevan el mismo perfil dentro.
 */
export function useUpdateProfile(service: Pick<ITeacherProfileService, "update"> = teacherProfileService) {
  const queryClient = useQueryClient();
  const teacherId = useSessionUserId();
  const { locale } = useTranslation();
  return useMutation({
    mutationFn: (changes: TeacherProfileChanges) => {
      if (teacherId === undefined) throw new Error("Sin sesión no hay perfil que guardar.");
      return service.update(teacherId, changes);
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(teacherProfileQuery(teacherId, locale).queryKey, updated);
      return queryClient.invalidateQueries({ queryKey: profileKeys.allDetails });
    },
  });
}
