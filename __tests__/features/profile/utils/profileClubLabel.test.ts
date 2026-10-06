import { profileClubLabel } from "@/features/profile/utils/profileClubLabel";
import { darkTheme } from "@/shared/config/theme";

import { profileClub } from "../../../helpers/profileFactories";

describe("profileClubLabel", () => {
  it("el nombre que tiene en la agenda", () => {
    expect(profileClubLabel(profileClub, () => ({ label: "Indoor Centro", colors: darkTheme.clubColors[0] }))).toBe(
      "Indoor Centro",
    );
  });

  it("si ya no está en «Mis clubes», el de Core: la sede o, sin nombre propio, la escuela", () => {
    const unknown = () => ({ label: "", colors: darkTheme.clubColorUnknown });

    expect(profileClubLabel(profileClub, unknown)).toBe("Club Padel Indoor Madrid");
    expect(profileClubLabel({ ...profileClub, club_name: null }, unknown)).toBe("Escuela Siete");
  });
});
