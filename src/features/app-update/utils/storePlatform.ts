import type { StoreUrls } from "../schemas/versionCheck.schema";

/** La tienda de la que se instala la app. */
export type StorePlatform = keyof StoreUrls;

/** La tienda de este móvil, o `null` donde no hay (la web). */
export function storePlatformOf(os: string): StorePlatform | null {
  return os === "ios" || os === "android" ? os : null;
}

/** La URL de la tienda de este móvil, o `null` si Core no la tiene. */
export function storeUrlFor(urls: StoreUrls, platform: StorePlatform | null): string | null {
  return platform ? urls[platform] : null;
}
