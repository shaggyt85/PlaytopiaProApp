import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { AvatarUploadSchema, type AvatarFile } from "../schemas/avatar.schema";

/**
 * Una subida tiene más margen que el resto de peticiones (15 s): si reducir
 * la foto falla, se sube la original, que puede pesar varios MB por red móvil.
 */
export const UPLOAD_TIMEOUT_MS = 60_000;

/** La foto de perfil del profesor con la sesión abierta. */
export interface IAvatarService {
  /** La sube (sustituye a la que tenía) y devuelve su URL nueva. */
  upload(file: AvatarFile): Promise<string>;
}

export class AvatarService implements IAvatarService {
  constructor(private readonly http: IHttpClient) {}

  async upload(file: AvatarFile): Promise<string> {
    const form = new FormData();
    // React Native sube un fichero con `{ uri, name, type }`, no con un Blob.
    form.append("avatarFile", file as unknown as Blob);
    const { url } = await this.http.post(ENDPOINTS.MOBILE_TEACHER.AVATAR_UPLOAD, form, AvatarUploadSchema, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: UPLOAD_TIMEOUT_MS,
    });
    return url;
  }
}

export const avatarService: IAvatarService = new AvatarService(httpClient);
