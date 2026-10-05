import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import {
  PasswordRecoveryResponseSchema,
  type PasswordRecoveryResponse,
} from "../schemas/auth.schema";

export interface IPasswordRecoveryService {
  requestRecovery(email: string): Promise<PasswordRecoveryResponse>;
}

export class PasswordRecoveryService implements IPasswordRecoveryService {
  constructor(private readonly http: IHttpClient) {}

  /**
   * Core envía un correo con el enlace para poner la contraseña nueva en la
   * web. `scope: "teacher"` es imprescindible: sin él, si el email también es
   * de alumno o admin, Core recupera esa otra cuenta (admin > alumno > profesor).
   */
  async requestRecovery(email: string): Promise<PasswordRecoveryResponse> {
    const data = await this.http.post<unknown>(ENDPOINTS.AUTH.PASSWORD_RECOVERY, {
      email,
      scope: "teacher",
    });
    return PasswordRecoveryResponseSchema.parse(data);
  }
}

export const passwordRecoveryService: IPasswordRecoveryService = new PasswordRecoveryService(
  httpClient,
);
