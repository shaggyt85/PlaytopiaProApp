import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import {
  SignInResponseSchema,
  type SignInRequest,
  type SignInResponse,
} from "../schemas/auth.schema";

import { AUTH_ENDPOINTS } from "./authEndpoints";

export interface ISignInService {
  signIn(request: SignInRequest): Promise<SignInResponse>;
}

export class SignInService implements ISignInService {
  constructor(private readonly http: IHttpClient) {}

  async signIn(request: SignInRequest): Promise<SignInResponse> {
    const data = await this.http.post<unknown>(AUTH_ENDPOINTS.SIGN_IN, request);
    return SignInResponseSchema.parse(data);
  }
}

export const signInService: ISignInService = new SignInService(httpClient);
