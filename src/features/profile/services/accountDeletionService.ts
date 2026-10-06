import { ENDPOINTS } from "@/shared/config/endpoints";
import type { IHttpClient } from "@/shared/services/BaseHttpClient";
import { httpClient } from "@/shared/services/httpClient";

import { AccountDeletionSchema, type AccountDeletion } from "../schemas/accountDeletion.schema";

/** La baja de la cuenta del profesor con la sesión abierta. */
export interface IAccountDeletionService {
  /** Da de baja su cuenta con el motivo. Core revoca su sesión al momento. */
  request(reason: string): Promise<AccountDeletion>;
}

export class AccountDeletionService implements IAccountDeletionService {
  constructor(private readonly http: IHttpClient) {}

  async request(reason: string): Promise<AccountDeletion> {
    const data = await this.http.post<unknown>(ENDPOINTS.MOBILE.ACCOUNT_DELETE, { reason });
    return AccountDeletionSchema.parse(data);
  }
}

export const accountDeletionService: IAccountDeletionService = new AccountDeletionService(httpClient);
