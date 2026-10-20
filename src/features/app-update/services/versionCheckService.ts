import { queryOptions, skipToken } from "@tanstack/react-query";

import { CachePolicy } from "@/shared/config/cachePolicies";
import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { VersionCheckSchema, type VersionCheck } from "../schemas/versionCheck.schema";
import type { StorePlatform } from "../utils/storePlatform";

/** Esta app, para Core: la de profesores tiene sus propias versiones. */
export const MOBILE_APP = "teacher";

export const versionCheckKeys = {
  all: ["version-check"] as const,
  of: (platform: StorePlatform | null, version: string | null) =>
    [...versionCheckKeys.all, platform, version] as const,
};

/** Si la versión instalada de la app tiene que actualizarse. */
export interface IVersionCheckService {
  check(platform: StorePlatform, currentVersion: string): Promise<VersionCheck>;
}

export class VersionCheckService implements IVersionCheckService {
  constructor(private readonly http: IHttpClient) {}

  async check(platform: StorePlatform, currentVersion: string): Promise<VersionCheck> {
    return this.http.get(ENDPOINTS.SYSTEM.VERSION_CHECK, VersionCheckSchema, {
      params: { platform, current_version: currentVersion, app: MOBILE_APP },
    });
  }
}

export const versionCheckService: IVersionCheckService = new VersionCheckService(httpClient);

/**
 * La receta del version-check: `ALWAYS_FRESH`, porque una versión vieja no
 * puede darse por buena, y se vuelve a preguntar al volver la app a primer
 * plano. Sin tienda o sin versión no se pregunta (`skipToken`).
 */
export function versionCheckQuery(
  platform: StorePlatform | null,
  version: string | null,
  service: IVersionCheckService = versionCheckService,
) {
  return queryOptions({
    queryKey: versionCheckKeys.of(platform, version),
    queryFn: platform && version ? () => service.check(platform, version) : skipToken,
    ...CachePolicy.ALWAYS_FRESH,
  });
}
