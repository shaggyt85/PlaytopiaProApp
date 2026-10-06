import { screen, within } from "@testing-library/react-native";

import { ProfileScreen } from "@/features/profile/ProfileScreen";
import { profileDetailsService } from "@/features/profile/services/profileDetailsService";
import { HttpError } from "@/shared/services/HttpError";
import { myClubsService } from "@/shared/services/myClubsService";
import { teacherProfileService } from "@/shared/services/teacherProfileService";

import { schoolCard } from "../../helpers/networkFactories";
import { profileDetails, teacherProfile } from "../../helpers/profileFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { signInTeacher } from "../../helpers/scheduleMocks";

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/features/profile/services/profileDetailsService", () => ({
  ...jest.requireActual("@/features/profile/services/profileDetailsService"),
  profileDetailsService: { get: jest.fn() },
}));
jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/shared/services/myClubsService", () => require("../../helpers/scheduleMocks").myClubsServiceModule());

describe("ProfileScreen", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(profileDetailsService.get).mockResolvedValue(profileDetails());
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({
      clubs: [schoolCard(4, 7, { club_name: "Club Padel Indoor Madrid" })],
    });
  });

  it("«Mi perfil», su cabecera, sus datos, su perfil profesional, sus clubes y cerrar sesión", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    renderWithProviders(<ProfileScreen />);

    expect(await screen.findByText("David Álvarez")).toBeTruthy();
    expect(screen.getByText("Mi perfil")).toBeTruthy();
    expect(screen.getByText("Entrenador · 6 años de experiencia")).toBeTruthy();
    expect(await screen.findByTestId("hours-card")).toBeTruthy();
    expect(await screen.findByText("8 de 11 clases en pista")).toBeTruthy();
    expect(screen.getByTestId("personal-data-card")).toBeTruthy();
    expect(screen.getByTestId("professional-card")).toBeTruthy();
    // También sale en las horas: se busca en su tarjeta.
    expect(await within(screen.getByTestId("my-clubs-card")).findByText("Club Padel Indoor Madrid")).toBeTruthy();
    expect(await screen.findByTestId("availability-card")).toBeTruthy();
    expect(await screen.findByText("2 días · 5 h semanales")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
  });

  it("las horas y la disponibilidad, en una sola petición", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    renderWithProviders(<ProfileScreen />);

    await screen.findByText("2 días · 5 h semanales");
    expect(profileDetailsService.get).toHaveBeenCalledTimes(1);
  });

  it("pide el perfil una sola vez: el mismo que usa la Agenda", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    renderWithProviders(<ProfileScreen />);

    await screen.findByText("David Álvarez");
    expect(teacherProfileService.get).toHaveBeenCalledTimes(1);
    expect(teacherProfileService.get).toHaveBeenCalledWith(42);
  });

  it("si fallan las horas y la disponibilidad, el resto del perfil se ve igual", async () => {
    jest.mocked(teacherProfileService.get).mockResolvedValue(teacherProfile());
    jest
      .mocked(profileDetailsService.get)
      .mockRejectedValue(HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 }));
    renderWithProviders(<ProfileScreen />);

    // Una petición para las dos tarjetas: cada una con su «Reintentar».
    expect(await screen.findAllByRole("button", { name: "Reintentar" })).toHaveLength(2);
    expect(screen.getByTestId("personal-data-card")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cerrar sesión" })).toBeTruthy();
  });

  it("si el perfil no llega, el error con «Reintentar»", async () => {
    jest
      .mocked(teacherProfileService.get)
      .mockRejectedValue(HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 }));
    renderWithProviders(<ProfileScreen />);

    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
    expect(screen.queryByTestId("profile-header")).toBeNull();
  });
});
