import { TermsService } from "@/features/auth/services/termsService";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";

// Core devuelve el TeacherResponse entero; la app solo se queda con lo de términos.
const teacher = {
  id: 42,
  name: "Ana",
  email: "ana@club.com",
  terms_version: null,
  accepted_terms_at: null,
};

describe("TermsService", () => {
  it("lee la versión aceptada del perfil del profesor", async () => {
    const http = fakeHttp(teacher);

    const result = await new TermsService(http).getTerms(42);

    expect(http.get).toHaveBeenCalledWith("/UserTeacher/42");
    expect(result).toEqual({ id: 42, terms_version: null, accepted_terms_at: null });
  });

  it("acepta con un PATCH de terms_version al mismo perfil", async () => {
    const http = fakeHttp({
      ...teacher,
      terms_version: "2026-07-01",
      accepted_terms_at: "2026-09-26T10:00:00",
    });

    const result = await new TermsService(http).acceptTerms(42, "2026-07-01");

    expect(http.patch).toHaveBeenCalledWith("/UserTeacher/42", { terms_version: "2026-07-01" });
    expect(result.terms_version).toBe("2026-07-01");
  });

  it("una respuesta sin terms_version no cumple el contrato", async () => {
    const http = fakeHttp({ id: 42 });

    await expect(new TermsService(http).getTerms(42)).rejects.toThrow();
  });
});
