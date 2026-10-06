import { ProfileDetailsSchema } from "@/features/profile/schemas/profileDetails.schema";

import { profileDetails, teacherProfileResponse } from "../../../helpers/profileFactories";

/** Lo que responde Core con `include=hours,availability`. */
const coreResponse = () => {
  const { hours, availability } = profileDetails();
  return { ...teacherProfileResponse(), hours, availability };
};

describe("ProfileDetailsSchema", () => {
  it("acepta el perfil con sus horas y su disponibilidad", () => {
    expect(ProfileDetailsSchema.parse(coreResponse())).toEqual(profileDetails());
  });

  it("acepta una sede sin nombre propio y sin semana guardada", () => {
    const availability = [{ db_id: 7, club_id: 70, school_name: "Escuela Siete", club_name: null, week: {} }];

    expect(ProfileDetailsSchema.parse({ ...coreResponse(), availability }).availability).toEqual(availability);
  });

  it.each(["hours", "availability"])("rechaza la respuesta sin %s: se pidió con include", (field) => {
    const { [field as "hours" | "availability"]: _removed, ...incomplete } = coreResponse();

    expect(() => ProfileDetailsSchema.parse(incomplete)).toThrow();
  });

  it("rechaza un mes que no es AAAA-MM", () => {
    const response = coreResponse();
    const months = [{ ...response.hours.months[0], month: "octubre" }];

    expect(() => ProfileDetailsSchema.parse({ ...response, hours: { ...response.hours, months } })).toThrow();
  });

  it("rechaza minutos negativos", () => {
    const response = coreResponse();
    const total = { ...response.hours.months[0].total, done_minutes: -60 };
    const months = [{ ...response.hours.months[0], total }];

    expect(() => ProfileDetailsSchema.parse({ ...response, hours: { ...response.hours, months } })).toThrow();
  });
});
