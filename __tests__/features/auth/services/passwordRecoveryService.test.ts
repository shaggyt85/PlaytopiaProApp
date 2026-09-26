import { PasswordRecoveryService } from "@/features/auth/services/passwordRecoveryService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

describe("PasswordRecoveryService", () => {
  it("pide la recuperación de la cuenta de profesor con el email en el cuerpo", async () => {
    const http = fakeHttp({ status: "ok" });

    const result = await new PasswordRecoveryService(http).requestRecovery("ana@club.com");

    expect(http.post).toHaveBeenCalledWith("/PassRecovery/request", {
      email: "ana@club.com",
      scope: "teacher",
    });
    expect(result).toEqual({ status: "ok" });
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    const http = fakeHttp({});

    await expect(new PasswordRecoveryService(http).requestRecovery("a@b.com")).rejects.toThrow();
  });
});
