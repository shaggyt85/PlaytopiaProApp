import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { ENDPOINTS } from "@/shared/config/endpoints";
import type { Locale } from "@/shared/locales";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";
import { teacherKeys } from "@/shared/services/teacherProfileService";

import { ProfileDetailsSchema, type ProfileDetails } from "../schemas/profileDetails.schema";

/**
 * Lo que Perfil pide además del perfil de siempre (`include` de Core). El login
 * y el inicio no lo piden: solo se lee al abrir Perfil.
 */
export const PROFILE_INCLUDES = ["hours", "availability"] as const;

/**
 * Claves de Perfil. Cuelgan de `teacherKeys.all`: invalidar el profesor
 * refresca a la vez el inicio y Perfil. Llevan el idioma, como el perfil.
 */
export const profileKeys = {
  details: (teacherId: number | undefined, locale: Locale) =>
    [...teacherKeys.all, "details", teacherId, locale] as const,
};

/** El perfil con sus horas y su disponibilidad. */
export interface IProfileDetailsService {
  get(teacherId: number): Promise<ProfileDetails>;
}

export class ProfileDetailsService implements IProfileDetailsService {
  constructor(private readonly http: IHttpClient) {}

  async get(teacherId: number): Promise<ProfileDetails> {
    const data = await this.http.get<unknown>(ENDPOINTS.TEACHERS.PROFILE(teacherId), {
      params: { include: PROFILE_INCLUDES.join(",") },
    });
    return ProfileDetailsSchema.parse(data);
  }
}

export const profileDetailsService: IProfileDetailsService = new ProfileDetailsService(httpClient);

/** La receta de la query de Perfil: clave, cómo se pide y su caché. Sin profesor no se pide. */
export const profileDetailsQuery = (
  teacherId: number | undefined,
  locale: Locale,
  service: IProfileDetailsService = profileDetailsService,
) =>
  queryOptions({
    queryKey: profileKeys.details(teacherId, locale),
    queryFn: teacherId === undefined ? skipToken : () => service.get(teacherId),
    ...CachePolicy.STANDARD,
  });
