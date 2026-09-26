import {
  SignUpFormSchema,
  SignUpResponseSchema,
  TERMS_VERSION,
  toSignUpRequest,
  type SignUpFormInput,
} from "@/features/auth/schemas/signUp.schema";
import { GENDER } from "@/shared/config/gender";

const valid: SignUpFormInput = {
  firstName: " Ana ",
  lastName: "García",
  email: " ana@club.com ",
  country: "ES",
  phone: "612345678",
  birthday: "1990-05-03",
  gender: GENDER.FEMALE,
  password: "Segura1!",
  confirmPassword: "Segura1!",
  acceptedTerms: true,
};

/** El primer mensaje de error de un campo con el formulario válido salvo ese cambio. */
const errorOf = (field: keyof SignUpFormInput, change: Partial<SignUpFormInput>) =>
  SignUpFormSchema.safeParse({ ...valid, ...change }).error?.issues.find(
    (issue) => issue.path[0] === field,
  )?.message;

describe("SignUpFormSchema", () => {
  it("acepta un formulario completo y recorta nombre y email", () => {
    const form = SignUpFormSchema.parse(valid);

    expect(form.firstName).toBe("Ana");
    expect(form.email).toBe("ana@club.com");
  });

  it("nombre y apellidos piden al menos 2 caracteres", () => {
    expect(errorOf("firstName", { firstName: " A " })).toBe("validation.firstNameMin");
    expect(errorOf("lastName", { lastName: "G" })).toBe("validation.lastNameMin");
  });

  it("el teléfono son solo cifras, de 9 a 15", () => {
    expect(errorOf("phone", { phone: "61234567a" })).toBe("validation.phoneNumbersOnly");
    expect(errorOf("phone", { phone: "61234567" })).toBe("validation.phoneMin");
    expect(errorOf("phone", { phone: "1234567890123456" })).toBe("validation.phoneMax");
  });

  it("la fecha de nacimiento es obligatoria", () => {
    expect(errorOf("birthday", { birthday: "" })).toBe("validation.birthdayRequired");
  });

  it.each([
    ["Corta1!", "validation.passwordMin"],
    ["sinmayuscula1!", "validation.passwordUppercase"],
    ["SINMINUSCULA1!", "validation.passwordLowercase"],
    ["SinNumero!", "validation.passwordNumber"],
    ["SinEspecial1", "validation.passwordSpecialChar"],
    ["Con Espacio1!", "validation.passwordNoSpaces"],
    [`${"A".repeat(50)}a1!`, "validation.passwordMax"],
  ])("la contraseña %s no vale: %s", (password, expected) => {
    expect(errorOf("password", { password, confirmPassword: password })).toBe(expected);
  });

  it("las contraseñas tienen que coincidir", () => {
    expect(errorOf("confirmPassword", { confirmPassword: "Otra1!aa" })).toBe(
      "validation.passwordsDontMatch",
    );
  });

  it("hay que aceptar los términos", () => {
    expect(errorOf("acceptedTerms", { acceptedTerms: false })).toBe("validation.acceptTerms");
  });
});

describe("toSignUpRequest", () => {
  it("arma el cuerpo de Core: teléfono con prefijo, fecha con hora y la versión de términos", () => {
    const request = toSignUpRequest(SignUpFormSchema.parse({ ...valid, country: "AR" }));

    expect(request).toEqual({
      name: "Ana",
      last_name: "García",
      email: "ana@club.com",
      password: "Segura1!",
      phone_number: "+54612345678",
      birthday: "1990-05-03T00:00:00",
      gender: GENDER.FEMALE,
      terms_version: TERMS_VERSION,
    });
  });
});

describe("SignUpResponseSchema", () => {
  it("una respuesta sin id no cumple el contrato", () => {
    expect(() => SignUpResponseSchema.parse({ email: "ana@club.com" })).toThrow();
  });
});
