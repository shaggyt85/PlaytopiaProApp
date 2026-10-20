import { AvailabilityService } from "@/features/profile/services/availabilityService";
import { ClubAvailabilitySchema } from "@/features/profile/schemas/profileDetails.schema";

import { createFakeHttpClient as fakeHttp } from "../../../helpers/fakeHttpClient";
import { profileClub } from "../../../helpers/profileFactories";

describe("AvailabilityService", () => {
  it("sustituye la semana de la sede con un PUT y devuelve como quedó", async () => {
    const saved = { ...profileClub, week: { "1": [16, 17] } };
    const http = fakeHttp(saved);

    const result = await new AvailabilityService(http).replace(7, 70, { "1": [17, 16] });

    expect(http.put).toHaveBeenCalledWith("/MobileTeacher/clubs/7/70/availability", { week: { "1": [17, 16] } }, ClubAvailabilitySchema);
    expect(result).toEqual(saved);
  });

  it("una respuesta con una hora que no existe no cumple el contrato", async () => {
    const http = fakeHttp({ ...profileClub, week: { "1": [24] } });

    await expect(new AvailabilityService(http).replace(7, 70, {})).rejects.toThrow();
  });
});
