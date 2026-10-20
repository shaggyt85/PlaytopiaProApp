import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { CheckEmailResponseSchema, type CheckEmailResponse } from "../schemas/auth.schema";

export interface ICheckEmailService {
  checkEmail(email: string): Promise<CheckEmailResponse>;
}

export class CheckEmailService implements ICheckEmailService {
  constructor(private readonly http: IHttpClient) {}

  async checkEmail(email: string): Promise<CheckEmailResponse> {
    // El email va en el cuerpo, no en la URL: así no queda en logs de proxies.
    return this.http.post(ENDPOINTS.AUTH.CHECK_EMAIL, { email }, CheckEmailResponseSchema);
  }
}

export const checkEmailService: ICheckEmailService = new CheckEmailService(httpClient);
