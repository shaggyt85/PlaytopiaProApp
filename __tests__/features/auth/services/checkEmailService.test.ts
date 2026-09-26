import { CheckEmailService } from "@/features/auth/services/checkEmailService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

describe("CheckEmailService", () => {
  it("manda el email en el cuerpo a /auth/check-email y valida la respuesta", async () => {
    const http = fakeHttp({
      email: "ana@club.com",
      exists: true,
      is_student: false,
      is_teacher: true,
    });

    const result = await new CheckEmailService(http).checkEmail("ana@club.com");

    expect(http.post).toHaveBeenCalledWith("/auth/check-email", { email: "ana@club.com" });
    expect(result.is_teacher).toBe(true);
  });

  it("una respuesta que no cumple el contrato falla", async () => {
    const http = fakeHttp({ exists: "sí" });
    await expect(new CheckEmailService(http).checkEmail("a@b.com")).rejects.toThrow();
  });
});
