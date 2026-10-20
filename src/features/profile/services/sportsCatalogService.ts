import { queryOptions } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { ENDPOINTS } from "@/shared/config/endpoints";
import type { Locale } from "@/shared/locales";
import type { TeacherSport } from "@/shared/schemas/teacherProfile.schema";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { SportsCatalogResponseSchema } from "../schemas/sportsCatalog.schema";

/** Claves del catálogo: no es de un profesor, pero sí de un idioma (lo traduce Core). */
export const sportsCatalogKeys = {
  all: ["sportsCatalog"] as const,
  catalog: (locale: Locale) => [...sportsCatalogKeys.all, locale] as const,
};

/** El catálogo de deportes que se pueden elegir en el perfil profesional. */
export interface ISportsCatalogService {
  getCatalog(): Promise<TeacherSport[]>;
}

export class SportsCatalogService implements ISportsCatalogService {
  constructor(private readonly http: IHttpClient) {}

  async getCatalog(): Promise<TeacherSport[]> {
    const { sports } = await this.http.get(ENDPOINTS.MOBILE_TEACHER.SPORTS, SportsCatalogResponseSchema);
    return sports;
  }
}

export const sportsCatalogService: ISportsCatalogService = new SportsCatalogService(httpClient);

/** La receta: lo cambia el Super Admin de vez en cuando (`STATIC`). */
export const sportsCatalogQuery = (locale: Locale, service: ISportsCatalogService = sportsCatalogService) =>
  queryOptions({
    queryKey: sportsCatalogKeys.catalog(locale),
    queryFn: () => service.getCatalog(),
    ...CachePolicy.STATIC,
  });
