import { screen } from "@testing-library/react-native";

import { MyClubsCard } from "@/features/profile/components/MyClubsCard";
import { myClubsService } from "@/shared/services/myClubsService";

import { schoolCard } from "../../../helpers/networkFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/shared/services/myClubsService", () => require("../../../helpers/scheduleMocks").myClubsServiceModule());

describe("MyClubsCard", () => {
  beforeEach(signInTeacher);

  it("las sedes donde está inscrito, con su nombre de la agenda", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({
      clubs: [
        schoolCard(4, 7, { name: "DN Padel Academy", club_name: "Sede Centro" }),
        schoolCard(5, 1, { name: "Wave Padel Club", club_name: null }),
      ],
    });
    renderWithProviders(<MyClubsCard />);

    expect(await screen.findByText("Sede Centro")).toBeTruthy();
    expect(screen.getByText("Wave Padel Club")).toBeTruthy();
    expect(screen.getAllByTestId("club-dot")).toHaveLength(2);
  });

  it("sin clubes, lo dice", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [] });
    renderWithProviders(<MyClubsCard />);

    expect(await screen.findByText("Aún no trabajas en ningún club")).toBeTruthy();
  });

  it("es solo de lectura", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
    renderWithProviders(<MyClubsCard />);

    await screen.findAllByTestId("club-dot");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
