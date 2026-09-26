import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { CheckEmailResponseSchema, type CheckEmailResponse } from "../schemas/auth.schema";

import { AUTH_ENDPOINTS } from "./authEndpoints";

export interface ICheckEmailService {
  checkEmail(email: string): Promise<CheckEmailResponse>;
}

export class CheckEmailService implements ICheckEmailService {
  constructor(private readonly http: IHttpClient) {}

  async checkEmail(email: string): Promise<CheckEmailResponse> {
    // El email va en el cuerpo, no en la URL: así no queda en logs de proxies.
    const data = await this.http.post<unknown>(AUTH_ENDPOINTS.CHECK_EMAIL, { email });
    return CheckEmailResponseSchema.parse(data);
  }
}

export const checkEmailService: ICheckEmailService = new CheckEmailService(httpClient);
