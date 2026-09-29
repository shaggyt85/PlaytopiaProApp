import { act, fireEvent, screen } from "@testing-library/react-native";

import { NetworkScreen } from "@/features/network";
import { networkService } from "@/features/network/services/networkService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { joinablePage, schoolCard } from "../../helpers/networkFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { settle } from "../../helpers/settle";

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/features/network/services/networkService", () => ({
  ...jest.requireActual("@/features/network/services/networkService"),
  networkService: { getMyClubs: jest.fn(), getJoinableSchools: jest.fn() },
}));

// Cada lista lleva la cabecera, pero la de la lista oculta no cuenta: una sola a la vista.
const pressTab = (name: string) => fireEvent.press(screen.getByRole("tab", { name }));

describe("NetworkScreen", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(networkService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
    jest.mocked(networkService.getJoinableSchools).mockResolvedValue(joinablePage(1, 1, [schoolCard(1, 1)], 1));
  });

  it("abre en «Mis clubes», con su título, y solo pide sus clubes", async () => {
    renderWithProviders(<NetworkScreen />);

    expect(await screen.findByTestId("my-clubs-list-4-7")).toBeVisible();
    expect(screen.getByRole("header", { name: "Red de clubes" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Mis clubes" }).props.accessibilityState).toEqual({ selected: true });
    await settle();
    expect(networkService.getJoinableSchools).not.toHaveBeenCalled();
  });

  it("al cambiar a «Cerca de mí» pide la primera página y la enseña; «Mis clubes» queda oculta", async () => {
    renderWithProviders(<NetworkScreen />);
    await screen.findByTestId("my-clubs-list-4-7");

    pressTab("Cerca de mí");

    expect(await screen.findByTestId("joinable-schools-list-1-1")).toBeVisible();
    // Oculta también para el lector de pantalla: solo aparece pidiendo lo oculto.
    expect(screen.queryByTestId("my-clubs-list-4-7")).toBeNull();
    expect(screen.getByTestId("my-clubs-list-4-7", { includeHiddenElements: true })).not.toBeVisible();
    expect(networkService.getJoinableSchools).toHaveBeenCalledWith(1);
  });

  it("al volver a «Mis clubes» no la pide otra vez, ni «Cerca de mí» al volver a ella", async () => {
    renderWithProviders(<NetworkScreen />);
    await screen.findByTestId("my-clubs-list-4-7");
    pressTab("Cerca de mí");
    await screen.findByTestId("joinable-schools-list-1-1");

    pressTab("Mis clubes");
    expect(screen.getByTestId("my-clubs-list-4-7")).toBeVisible();
    pressTab("Cerca de mí");
    await settle();

    expect(networkService.getMyClubs).toHaveBeenCalledTimes(1);
    expect(networkService.getJoinableSchools).toHaveBeenCalledTimes(1);
  });

  it("la lista oculta no pide páginas aunque avise de que ha llegado al final", async () => {
    renderWithProviders(<NetworkScreen />);
    await screen.findByTestId("my-clubs-list-4-7");

    act(() => screen.getByTestId("joinable-schools-list", { includeHiddenElements: true }).props.onEndReached());
    await settle();

    expect(networkService.getJoinableSchools).not.toHaveBeenCalled();
  });
});
