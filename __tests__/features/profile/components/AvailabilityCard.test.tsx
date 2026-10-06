import { screen, within } from "@testing-library/react-native";

import { AvailabilityCard } from "@/features/profile/components/AvailabilityCard";
import { profileDetailsService } from "@/features/profile/services/profileDetailsService";
import { HttpError } from "@/shared/services/HttpError";
import { myClubsService } from "@/shared/services/myClubsService";

import { schoolCard } from "../../../helpers/networkFactories";
import { profileClub, profileDetails } from "../../../helpers/profileFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";

jest.mock("@/features/profile/services/profileDetailsService", () => ({
  ...jest.requireActual("@/features/profile/services/profileDetailsService"),
  profileDetailsService: { get: jest.fn() },
}));
jest.mock("@/shared/services/myClubsService", () => require("../../../helpers/scheduleMocks").myClubsServiceModule());

describe("AvailabilityCard", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({
      clubs: [schoolCard(7, 70, { club_name: "Indoor Centro" })],
    });
  });

  it("cada sede con su nombre de la agenda, su resumen y sus tramos", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(profileDetails());
    renderWithProviders(<AvailabilityCard />);

    const sede = within(await screen.findByTestId("availability-7-70"));
    expect(screen.getByRole("header", { name: "Disponibilidad" })).toBeTruthy();
    expect(await sede.findByText("Indoor Centro")).toBeTruthy();
    expect(sede.getByText("2 días · 5 h semanales")).toBeTruthy();
    expect(sede.getByText("Lun 16:00–19:00 · Mié 09:00–11:00")).toBeTruthy();
  });

  it("una sede sin semana, dice que aún no la ha indicado", async () => {
    jest
      .mocked(profileDetailsService.get)
      .mockResolvedValue(profileDetails({ availability: [{ ...profileClub, week: {} }] }));
    renderWithProviders(<AvailabilityCard />);

    expect(await screen.findByText("Aún no has indicado tu disponibilidad")).toBeTruthy();
  });

  it("sin sedes, lo dice, como la tarjeta de clubes", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(profileDetails({ availability: [] }));
    renderWithProviders(<AvailabilityCard />);

    expect(await screen.findByText("Aún no trabajas en ningún club")).toBeTruthy();
  });

  it("si no llega, el error en la tarjeta con «Reintentar»", async () => {
    jest
      .mocked(profileDetailsService.get)
      .mockRejectedValue(HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 }));
    renderWithProviders(<AvailabilityCard />);

    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
  });

  it("sin «Editar» hasta que llegue su editor", async () => {
    jest.mocked(profileDetailsService.get).mockResolvedValue(profileDetails());
    renderWithProviders(<AvailabilityCard />);

    await screen.findByTestId("availability-7-70");
    expect(screen.queryByRole("button")).toBeNull();
  });
});
