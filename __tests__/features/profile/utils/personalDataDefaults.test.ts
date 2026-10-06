import { personalDataDefaults } from "@/features/profile/utils/personalDataDefaults";
import { GENDER } from "@/shared/config/gender";

import { teacherProfile } from "../../../helpers/profileFactories";

describe("personalDataDefaults", () => {
  it("el formulario con lo guardado: el teléfono en país y número, la fecha sin hora", () => {
    expect(personalDataDefaults(teacherProfile())).toEqual({
      firstName: "David",
      lastName: "Álvarez",
      email: "david@playtopia.com",
      country: "ES",
      phone: "600123456",
      birthday: "1990-05-15",
      gender: GENDER.MALE,
    });
  });

  it("sin fecha, vacía; sin género, «no lo dice»", () => {
    expect(personalDataDefaults(teacherProfile({ birthday: null, gender: null }))).toMatchObject({
      birthday: "",
      gender: GENDER.NONE,
    });
  });

  it("un género que no es de las opciones cuenta como «no lo dice»", () => {
    expect(personalDataDefaults(teacherProfile({ gender: 7 })).gender).toBe(GENDER.NONE);
  });
});
