import { act, screen, waitFor } from "@testing-library/react-native";

import { JoinableSchoolsList } from "@/features/network/components/JoinableSchoolsList";
import { networkService } from "@/features/network/services/networkService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { joinablePage, schoolCard } from "../../../helpers/networkFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { settle } from "../../../helpers/settle";

jest.mock("expo-image", () => ({ Image: () => null }));
jest.mock("@/features/network/services/networkService", () => ({
  ...jest.requireActual("@/features/network/services/networkService"),
  networkService: { getJoinableSchools: jest.fn() },
}));

const getPage = () => jest.mocked(networkService.getJoinableSchools);
const endReached = () => act(() => screen.getByTestId("joinable-schools-list").props.onEndReached());

describe("JoinableSchoolsList", () => {
  beforeEach(() => useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 }));

  it("sin la pestaña a la vista no pide nada", async () => {
    renderWithProviders(<JoinableSchoolsList enabled={false} />);
    await settle();

    expect(getPage()).not.toHaveBeenCalled();
  });

  it("pinta la primera página y, al llegar al final, junta la siguiente", async () => {
    getPage()
      .mockResolvedValueOnce(joinablePage(1, 2, [schoolCard(1, 1)], 2))
      .mockResolvedValueOnce(joinablePage(2, 2, [schoolCard(2, 1)], 2));
    renderWithProviders(<JoinableSchoolsList enabled />);
    await screen.findByTestId("joinable-schools-list-1-1");

    await endReached();

    expect(await screen.findByTestId("joinable-schools-list-2-1")).toBeTruthy();
    expect(getPage()).toHaveBeenLastCalledWith(2);
  });

  it("en la última página, llegar al final no pide más", async () => {
    getPage().mockResolvedValue(joinablePage(1, 1, [schoolCard(1, 1)], 1));
    renderWithProviders(<JoinableSchoolsList enabled />);
    await screen.findByTestId("joinable-schools-list-1-1");

    await endReached();
    await settle();

    expect(getPage()).toHaveBeenCalledTimes(1);
  });

  it("sin escuelas nuevas, lo dice", async () => {
    getPage().mockResolvedValue(joinablePage(1, 0, [], 0));
    renderWithProviders(<JoinableSchoolsList enabled />);

    expect(await screen.findByText("No hay escuelas nuevas")).toBeTruthy();
  });

  it("tirar para refrescar pide solo la primera página", async () => {
    getPage()
      .mockResolvedValueOnce(joinablePage(1, 3, [schoolCard(1, 1)]))
      .mockResolvedValueOnce(joinablePage(2, 3, [schoolCard(2, 1)]))
      .mockResolvedValue(joinablePage(1, 3, [schoolCard(9, 1)]));
    renderWithProviders(<JoinableSchoolsList enabled />);
    await screen.findByTestId("joinable-schools-list-1-1");
    await endReached();
    await screen.findByTestId("joinable-schools-list-2-1");

    const { refreshControl } = screen.getByTestId("joinable-schools-list").props;
    await act(() => refreshControl.props.onRefresh());

    expect(await screen.findByTestId("joinable-schools-list-9-1")).toBeTruthy();
    await waitFor(() => expect(getPage()).toHaveBeenCalledTimes(3));
    expect(getPage()).toHaveBeenLastCalledWith(1);
  });
});
