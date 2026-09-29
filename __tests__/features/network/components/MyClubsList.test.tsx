import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { MyClubsList } from "@/features/network/components/MyClubsList";
import { myClubsService } from "@/shared/services/myClubsService";
import { HttpError } from "@/shared/services/HttpError";
import { useSessionStore } from "@/shared/store/sessionStore";

import { schoolCard } from "../../../helpers/networkFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/shared/services/myClubsService", () => ({
  ...jest.requireActual("@/shared/services/myClubsService"),
  myClubsService: { getMyClubs: jest.fn() },
}));

describe("MyClubsList", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("pinta las sedes donde trabaja", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });

    renderWithProviders(<MyClubsList />);

    expect(await screen.findByTestId("my-clubs-list-4-7")).toBeTruthy();
  });

  it("sin clubes, le manda a mirar en «Cerca de mí», sin botón", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [] });

    renderWithProviders(<MyClubsList />);

    expect(await screen.findByText("Aún no trabajas en ningún club")).toBeTruthy();
    expect(screen.getByText("Mira en «Cerca de mí» las escuelas a las que puedes unirte.")).toBeTruthy();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("si falla, «Reintentar» vuelve a pedirlos", async () => {
    jest
      .mocked(myClubsService.getMyClubs)
      .mockRejectedValueOnce(HttpError.fromResponse(403, { type: "about:blank", title: "Forbidden", status: 403 }))
      .mockResolvedValue({ clubs: [schoolCard(4, 7)] });

    renderWithProviders(<MyClubsList />);
    fireEvent.press(await screen.findByRole("button", { name: "Reintentar" }));

    expect(await screen.findByTestId("my-clubs-list-4-7")).toBeTruthy();
  });

  it("tirar para refrescar vuelve a pedirlos", async () => {
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
    renderWithProviders(<MyClubsList />);
    await screen.findByTestId("my-clubs-list-4-7");

    const { refreshControl } = screen.getByTestId("my-clubs-list").props;
    await refreshControl.props.onRefresh();

    await waitFor(() => expect(myClubsService.getMyClubs).toHaveBeenCalledTimes(2));
  });
});
