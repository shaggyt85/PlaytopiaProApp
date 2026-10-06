import { withClubWeek } from "@/features/profile/utils/withClubWeek";

import { profileClub, profileDetails } from "../../../helpers/profileFactories";

describe("withClubWeek", () => {
  const other = { ...profileClub, club_id: 71, club_name: "Norte", week: { "2": [9] } };

  it("cambia solo la semana de esa sede", () => {
    const details = profileDetails({ availability: [{ ...profileClub, week: { "1": [16] } }, other] });

    const updated = withClubWeek(details, { ...profileClub, week: { "5": [20, 21] } });

    expect(updated?.availability).toEqual([{ ...profileClub, week: { "5": [20, 21] } }, other]);
    expect(updated?.hours).toBe(details.hours);
  });

  it("sin detalles en la caché, nada", () => {
    expect(withClubWeek(undefined, { ...profileClub, week: {} })).toBeUndefined();
  });
});
