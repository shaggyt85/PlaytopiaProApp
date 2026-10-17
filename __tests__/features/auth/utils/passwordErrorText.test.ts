import { passwordErrorText } from "@/features/auth/utils/passwordErrorText";
import { t } from "@/shared/config/i18n";
import { HttpError } from "@/shared/services/HttpError";

const httpError = (status: number) => HttpError.fromResponse(status, {});

describe("passwordErrorText", () => {
  it("sin error, nada", () => {
    expect(passwordErrorText(null, false, t)).toBeNull();
  });

  it("un 401 son credenciales incorrectas; si el email también es de alumno, con la aclaración", () => {
    const base = t("auth.password.invalidCredentials");

    expect(passwordErrorText(httpError(401), false, t)).toBe(base);
    expect(passwordErrorText(httpError(401), true, t)).toBe(`${base} ${t("auth.password.studentHint")}`);
  });

  it("lo demás, como en toda la app", () => {
    expect(passwordErrorText(httpError(500), false, t)).toBe(t("errors.byStatus.500"));
  });
});
