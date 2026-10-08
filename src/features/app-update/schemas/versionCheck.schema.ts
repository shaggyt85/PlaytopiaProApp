import { z } from "zod";

/**
 * Lo que responde Core al version-check (`GET /App/version-check`), lo que se
 * usa: qué hacer con esta versión y dónde se descarga la nueva. Las notas de la
 * versión no se enseñan.
 */
export const VersionCheckSchema = z.object({
  /** `force`: ya no vale; `soft`: hay una nueva; `none`: está al día. */
  update_type: z.enum(["force", "soft", "none"]),
  /** La URL de cada tienda; `null` si no está configurada. */
  store_url: z.object({
    ios: z.string().nullable(),
    android: z.string().nullable(),
  }),
});
export type VersionCheck = z.infer<typeof VersionCheckSchema>;
export type UpdateType = VersionCheck["update_type"];
export type StoreUrls = VersionCheck["store_url"];
