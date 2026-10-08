import { useQuery } from "@tanstack/react-query";
import { Platform } from "react-native";

import { APP_VERSION } from "@/shared/config/appVersion";

import { versionCheckQuery, versionCheckService, type IVersionCheckService } from "../services/versionCheckService";
import { storePlatformOf, storeUrlFor } from "../utils/storePlatform";
import { updateNotice } from "../utils/updateNotice";

/**
 * Qué aviso de actualizar toca enseñar en este móvil, y a qué tienda lleva su
 * botón. Pregunta con la versión instalada y la tienda de este móvil.
 */
export function useAppUpdate(service: IVersionCheckService = versionCheckService) {
  const platform = storePlatformOf(Platform.OS);
  const { data } = useQuery(versionCheckQuery(platform, APP_VERSION, service));
  return {
    notice: updateNotice(data),
    storeUrl: data ? storeUrlFor(data.store_url, platform) : null,
  };
}
