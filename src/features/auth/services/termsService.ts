import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { TeacherTermsSchema, type TeacherTerms } from "../schemas/terms.schema";

import { AUTH_ENDPOINTS } from "./authEndpoints";

export interface ITermsService {
  /** Qué versión de los términos tiene aceptada el profesor. */
  getTerms(teacherId: number): Promise<TeacherTerms>;
  /** Acepta `version`; Core sella la fecha de aceptación. */
  acceptTerms(teacherId: number, version: string): Promise<TeacherTerms>;
}

export class TermsService implements ITermsService {
  constructor(private readonly http: IHttpClient) {}

  async getTerms(teacherId: number): Promise<TeacherTerms> {
    const data = await this.http.get<unknown>(AUTH_ENDPOINTS.TEACHER(teacherId));
    return TeacherTermsSchema.parse(data);
  }

  async acceptTerms(teacherId: number, version: string): Promise<TeacherTerms> {
    const data = await this.http.patch<unknown>(AUTH_ENDPOINTS.TEACHER(teacherId), {
      terms_version: version,
    });
    return TeacherTermsSchema.parse(data);
  }
}

export const termsService: ITermsService = new TermsService(httpClient);
