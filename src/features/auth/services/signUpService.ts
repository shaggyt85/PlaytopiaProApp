import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import {
  SignUpResponseSchema,
  type SignUpRequest,
  type SignUpResponse,
} from "../schemas/signUp.schema";

import { AUTH_ENDPOINTS } from "./authEndpoints";
import { createRegistrationToken } from "./registrationToken";

export interface ISignUpService {
  signUp(request: SignUpRequest): Promise<SignUpResponse>;
}

export class SignUpService implements ISignUpService {
  constructor(
    private readonly http: IHttpClient,
    private readonly signToken: () => string = createRegistrationToken,
  ) {}

  /** Firma el token justo antes de enviar: caduca a los `TOKEN_SKEW_SECONDS`. */
  async signUp(request: SignUpRequest): Promise<SignUpResponse> {
    const data = await this.http.post<unknown>(AUTH_ENDPOINTS.SIGN_UP, {
      ...request,
      registration_token: this.signToken(),
    });
    return SignUpResponseSchema.parse(data);
  }
}

export const signUpService: ISignUpService = new SignUpService(httpClient);
