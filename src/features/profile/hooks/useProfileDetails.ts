import { useQuery } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ProfileDetails } from "../schemas/profileDetails.schema";
import { profileDetailsQuery, profileDetailsService, type IProfileDetailsService } from "../services/profileDetailsService";

/** Lo que Perfil toma de esta respuesta: sus horas y su disponibilidad. */
export type ProfileExtras = Pick<ProfileDetails, "hours" | "availability">;

/**
 * Fuera del componente para que sea estable. Lo demás del perfil (datos
 * personales y profesionales) sale de `useTeacherProfile`, la caché que deja el
 * login: cada dato de la pantalla, de una sola caché.
 */
const selectExtras = ({ hours, availability }: ProfileDetails): ProfileExtras => ({ hours, availability });

/** Las horas y la disponibilidad del profesor con la sesión abierta. */
export function useProfileDetails(service: IProfileDetailsService = profileDetailsService) {
  const teacherId = useSessionUserId();
  const { locale } = useTranslation();
  return useQuery({ ...profileDetailsQuery(teacherId, locale, service), select: selectExtras });
}
