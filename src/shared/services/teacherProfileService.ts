import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import {
  TeacherProfileSchema,
  type TeacherProfile,
  type TeacherProfileChanges,
} from "@/shared/schemas/teacherProfile.schema";

import type { IHttpClient } from "./BaseHttpClient";
import { httpClient } from "./httpClient";

/** Rutas de Core del perfil del profesor (Scalar, grupo Users → Teachers). */
export const TEACHER_ENDPOINTS = {
  PROFILE: (teacherId: number) => `/UserTeacher/${teacherId}`,
} as const;

/** Claves de caché del profesor: siempre con su id. */
export const teacherKeys = {
  all: ["teacher"] as const,
  profile: (teacherId: number | undefined) => [...teacherKeys.all, "profile", teacherId] as const,
};

/**
 * Perfil del profesor. Lo usan el acceso (términos) y el inicio (nombre): un
 * solo sitio para el endpoint y su contrato.
 */
export interface ITeacherProfileService {
  get(teacherId: number): Promise<TeacherProfile>;
  /** Devuelve el perfil ya actualizado. */
  update(teacherId: number, changes: TeacherProfileChanges): Promise<TeacherProfile>;
}

export class TeacherProfileService implements ITeacherProfileService {
  constructor(private readonly http: IHttpClient) {}

  async get(teacherId: number): Promise<TeacherProfile> {
    return TeacherProfileSchema.parse(await this.http.get<unknown>(TEACHER_ENDPOINTS.PROFILE(teacherId)));
  }

  async update(teacherId: number, changes: TeacherProfileChanges): Promise<TeacherProfile> {
    const data = await this.http.patch<unknown>(TEACHER_ENDPOINTS.PROFILE(teacherId), changes);
    return TeacherProfileSchema.parse(data);
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
  service: Pick<ITeacherProfileService, "get"> = teacherProfileService,
) =>
  queryOptions({
    queryKey: teacherKeys.profile(teacherId),
    queryFn: teacherId === undefined ? skipToken : () => service.get(teacherId),
    ...CachePolicy.STANDARD,
  });
