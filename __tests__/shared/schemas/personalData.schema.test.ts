import { GENDER } from "@/shared/config/gender";
import {
  PersonalDataFormSchema,
  toPersonalDataRequest,
  type PersonalDataFormInput,
} from "@/shared/schemas/personalData.schema";

const form = (overrides: Partial<PersonalDataFormInput> = {}): PersonalDataFormInput => ({
  firstName: "David",
  lastName: "Álvarez",
  email: "david@playtopia.com",
  country: "ES",
  phone: "600123456",
  birthday: "1990-05-15",
  gender: GENDER.MALE,
  ...overrides,
});

describe("PersonalDataFormSchema", () => {
  it("acepta los datos personales y quita los espacios del nombre y el email", () => {
    expect(PersonalDataFormSchema.parse(form({ firstName: " David ", email: " david@playtopia.com " }))).toMatchObject({
      firstName: "David",
      email: "david@playtopia.com",
    });
  });

  it("la fecha de nacimiento es opcional (en el alta la exige su schema)", () => {
    expect(PersonalDataFormSchema.safeParse(form({ birthday: "" })).success).toBe(true);
  });

  it.each([
    ["un nombre de una letra", { firstName: "D" }, "validation.firstNameMin"],
    ["un email sin arroba", { email: "david" }, "validation.emailInvalid"],
    ["un teléfono con letras", { phone: "600abc456" }, "validation.phoneNumbersOnly"],
    ["un teléfono corto", { phone: "600" }, "validation.phoneMin"],
  ])("rechaza %s con su clave de i18n", (_case, overrides, key) => {
    const result = PersonalDataFormSchema.safeParse(form(overrides));

    expect(result.success).toBe(false);
    expect(result.error?.issues.map((issue) => issue.message)).toContain(key);
  });
});

describe("toPersonalDataRequest", () => {
  it("el formulario como lo espera Core: el teléfono con su prefijo y la fecha con su hora", () => {
    expect(toPersonalDataRequest(PersonalDataFormSchema.parse(form()))).toEqual({
      name: "David",
      last_name: "Álvarez",
      email: "david@playtopia.com",
      phone_number: "+34600123456",
      birthday: "1990-05-15T00:00:00",
      gender: GENDER.MALE,
    });
  });

  it("sin fecha, no la envía (no se toca)", () => {
    expect(toPersonalDataRequest(PersonalDataFormSchema.parse(form({ birthday: "" })))).not.toHaveProperty("birthday");
  });
});
