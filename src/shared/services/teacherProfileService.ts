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
  profile: (teacherId: number) => [...teacherKeys.all, "profile", teacherId] as const,
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
