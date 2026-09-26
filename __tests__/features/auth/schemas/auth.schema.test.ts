import {
  CheckEmailResponseSchema,
  EmailFormSchema,
  PasswordFormSchema,
  SignInResponseSchema,
} from "@/features/auth/schemas/auth.schema";

describe("EmailFormSchema", () => {
  it("acepta un email y le quita los espacios", () => {
    expect(EmailFormSchema.parse({ email: "  ana@club.com " })).toEqual({
      email: "ana@club.com",
    });
  });

  it("vacío pide el email; mal escrito dice que no es válido (claves de i18n)", () => {
    const vacio = EmailFormSchema.safeParse({ email: "  " });
    const malo = EmailFormSchema.safeParse({ email: "ana@" });

    expect(vacio.error?.issues[0].message).toBe("validation.emailRequired");
    expect(malo.error?.issues[0].message).toBe("validation.emailInvalid");
  });
});

describe("PasswordFormSchema", () => {
  it("exige contraseña", () => {
    const result = PasswordFormSchema.safeParse({ password: "" });
    expect(result.error?.issues[0].message).toBe("validation.passwordRequired");
  });
});

describe("contratos de Core", () => {
  it("check-email trae exists, is_student e is_teacher", () => {
    const body = { email: "a@b.com", exists: true, is_student: false, is_teacher: true };
    expect(CheckEmailResponseSchema.parse(body)).toEqual(body);
  });

  it("check-email sin is_teacher no cumple el contrato", () => {
    expect(() =>
      CheckEmailResponseSchema.parse({ email: "a@b.com", exists: true, is_student: true }),
    ).toThrow();
  });

  it("login rechaza una respuesta sin tokens", () => {
    expect(() =>
      SignInResponseSchema.parse({ id: 1, role_id: 4, db_id: 7 }),
    ).toThrow();
  });
});
