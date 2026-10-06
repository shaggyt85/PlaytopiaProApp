import { personalRows } from "@/features/profile/utils/personalRows";
import { t } from "@/shared/config/i18n";
import { GENDER } from "@/shared/config/gender";

import { teacherProfile } from "../../../helpers/profileFactories";

const labels = (profile = teacherProfile()) => personalRows(profile, t).map(({ key, label }) => [key, label]);

describe("personalRows", () => {
  it("email, teléfono, nacimiento y género, en ese orden", () => {
    expect(labels()).toEqual([
      ["email", "david@playtopia.com"],
      ["phone", "+34600123456"],
      ["birthday", "15/05/1990"],
      ["gender", "Masculino"],
    ]);
  });

  it("lo que no tiene no sale", () => {
    expect(labels(teacherProfile({ phone_number: " ", birthday: null, gender: null }))).toEqual([
      ["email", "david@playtopia.com"],
    ]);
  });

  it("«no lo dice» no se enseña como género", () => {
    expect(labels(teacherProfile({ gender: GENDER.NONE })).map(([key]) => key)).not.toContain("gender");
  });

  it("la fecha de nacimiento es de calendario: no se mueve con la zona", () => {
    expect(labels(teacherProfile({ birthday: "1990-01-01T00:00:00" }))).toContainEqual(["birthday", "01/01/1990"]);
  });
});
