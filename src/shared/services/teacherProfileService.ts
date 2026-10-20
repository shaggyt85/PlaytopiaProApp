import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { ENDPOINTS } from "@/shared/config/endpoints";
import type { Locale } from "@/shared/locales";
import {
  TeacherProfileSchema,
  type TeacherProfile,
  type TeacherProfileChanges,
} from "@/shared/schemas/teacherProfile.schema";

import type { IHttpClient } from "./BaseHttpClient";
import { httpClient } from "./httpClient";

/**
 * Claves de caché del profesor: siempre con su id. El perfil lleva textos que
 * traduce Core (los deportes), así que su clave lleva el idioma: al cambiarlo se
 * piden de nuevo en el nuevo. Todo lo del profesor cuelga de `all`, así una sola
 * invalidación lo refresca entero.
 */
export const teacherKeys = {
  all: ["teacher"] as const,
  profile: (teacherId: number | undefined, locale: Locale) =>
    [...teacherKeys.all, "profile", teacherId, locale] as const,
};

/**
 * Perfil del profesor. Lo usan el acceso (términos), el inicio (nombre y foto)
 * y Perfil: un solo servicio para el endpoint y su contrato.
 */
export interface ITeacherProfileService {
  get(teacherId: number): Promise<TeacherProfile>;
  /** Devuelve el perfil ya actualizado. */
  update(teacherId: number, changes: TeacherProfileChanges): Promise<TeacherProfile>;
}

export class TeacherProfileService implements ITeacherProfileService {
  constructor(private readonly http: IHttpClient) {}

  async get(teacherId: number): Promise<TeacherProfile> {
    return this.http.get(ENDPOINTS.TEACHERS.PROFILE(teacherId), TeacherProfileSchema);
  }

  async update(teacherId: number, changes: TeacherProfileChanges): Promise<TeacherProfile> {
    return this.http.patch(ENDPOINTS.TEACHERS.PROFILE(teacherId), changes, TeacherProfileSchema);
  }
}

export const teacherProfileService: ITeacherProfileService = new TeacherProfileService(httpClient);

/**
 * La receta de la query del perfil, en un solo sitio: clave, cómo se pide y su
 * caché. Quien lee la usa entera; quien escribe (el acceso) usa su `queryKey`,
 * que sabe qué guarda: `setQueryData` solo acepta un `TeacherProfile`. Sin
 * profesor no se pide nada (`skipToken`).
 */
export const teacherProfileQuery = (
  teacherId: number | undefined,
  locale: Locale,
  service: Pick<ITeacherProfileService, "get"> = teacherProfileService,
) =>
  queryOptions({
    queryKey: teacherKeys.profile(teacherId, locale),
    queryFn: teacherId === undefined ? skipToken : () => service.get(teacherId),
    // LIVE: al volver a la app se mira si los términos siguen al día (OpenSessionTermsGate).
    ...CachePolicy.LIVE,
  });
