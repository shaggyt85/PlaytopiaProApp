import { useMutation } from "@tanstack/react-query";

import type { TeacherProfileChanges } from "@/shared/schemas/teacherProfile.schema";
import { teacherProfileService, type ITeacherProfileService } from "@/shared/services/teacherProfileService";
import { useSessionUserId } from "@/shared/store/sessionStore";

import { useStoreProfile } from "./useStoreProfile";

/**
 * Guarda cambios del perfil del profesor con la sesión abierta. Core devuelve
 * el perfil como queda, y se deja en la caché (`useStoreProfile`).
 */
export function useUpdateProfile(service: Pick<ITeacherProfileService, "update"> = teacherProfileService) {
  const teacherId = useSessionUserId();
  const storeProfile = useStoreProfile();
  return useMutation({
    mutationFn: (changes: TeacherProfileChanges) => {
      if (teacherId === undefined) throw new Error("Sin sesión no hay perfil que guardar.");
      return service.update(teacherId, changes);
    },
    onSuccess: (updated) => storeProfile(updated),
  });
}
