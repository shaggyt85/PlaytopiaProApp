import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import {
  SignInResponseSchema,
  type SignInRequest,
  type SignInResponse,
} from "../schemas/auth.schema";

export interface ISignInService {
  signIn(request: SignInRequest): Promise<SignInResponse>;
}

export class SignInService implements ISignInService {
  constructor(private readonly http: IHttpClient) {}

  async signIn(request: SignInRequest): Promise<SignInResponse> {
    return this.http.post(ENDPOINTS.AUTH.SIGN_IN, request, SignInResponseSchema);
  }
}

export const signInService: ISignInService = new SignInService(httpClient);
