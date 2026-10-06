import { AccountDeletionService } from "@/features/profile/services/accountDeletionService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

const deletion = { summary: { schools_count: 1, clubs_count: 2, unassigned_sessions: 0 }, anonymize_after_days: 30 };

describe("AccountDeletionService", () => {
  it("da de baja la cuenta con un POST y el motivo, no con un DELETE", async () => {
    const http = fakeHttp(deletion);

    const result = await new AccountDeletionService(http).request("Dejo de dar clases");

    expect(http.post).toHaveBeenCalledWith("/Mobile/Account/Delete", { reason: "Dejo de dar clases" });
    expect(result).toEqual(deletion);
  });

  it("una respuesta sin los días no cumple el contrato", async () => {
    const http = fakeHttp({ summary: deletion.summary });

    await expect(new AccountDeletionService(http).request("Dejo de dar clases")).rejects.toThrow();
  });
});
