import { act, fireEvent, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { DaySchedule } from "@/features/schedule/components/DaySchedule";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { myClubsService } from "@/shared/services/myClubsService";
import { useSessionStore } from "@/shared/store/sessionStore";

import { schoolCard } from "../../../helpers/networkFactories";
import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { nextClass, scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/services/scheduleService", () => ({
  ...jest.requireActual("@/features/schedule/services/scheduleService"),
  scheduleService: { getClasses: jest.fn() },
}));
jest.mock("@/shared/services/myClubsService", () => ({
  ...jest.requireActual("@/shared/services/myClubsService"),
  myClubsService: { getMyClubs: jest.fn() },
}));

// Lunes 5 de octubre de 2026 a las 15:21 del teléfono.
const NOW = new Date(2026, 9, 5, 15, 21).getTime();
const cantera = scheduleClass({ id: 31, class_date: "2026-10-05", class_time: "16:00:00" });
const tuesday = scheduleClass({ id: 32, class_date: "2026-10-06", class_time: "10:00:00" });

describe("DaySchedule", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(myClubsService.getMyClubs).mockResolvedValue({ clubs: [schoolCard(4, 7)] });
    jest
      .mocked(scheduleService.getClasses)
      .mockResolvedValue(scheduleResponse({ classes: [cantera, tuesday], next_class: nextClass({ id: 31 }) }));
  });

  it("hoy: la barra, la pastilla, el contador y la tira con sus clases", async () => {
    renderWithProviders(<DaySchedule now={NOW} />);

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(screen.getByText("lunes 5 · 15:21")).toBeTruthy();
    expect(screen.getByText("Hoy · lunes 5")).toBeTruthy();
    expect(screen.getByText("1 clase")).toBeTruthy();
    expect(screen.getByTestId("class-31-next")).toBeTruthy();
  });

  it("› enseña el día siguiente sin volver a pedir y el lector de pantalla lo anuncia", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    renderWithProviders(<DaySchedule now={NOW} />);
    await screen.findByTestId("class-31");

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));

    expect(screen.getByText("martes 6")).toBeTruthy();
    expect(screen.getByText("martes 6 · 15:21")).toBeTruthy();
    expect(screen.getByTestId("class-32")).toBeTruthy();
    expect(screen.queryByTestId("class-31")).toBeNull();
    expect(announce).toHaveBeenCalledWith("martes 6");
    expect(scheduleService.getClasses).toHaveBeenCalledTimes(1);
    announce.mockRestore();
  });

  it("un día sin clases: «Día libre»", async () => {
    renderWithProviders(<DaySchedule now={NOW} />);
    await screen.findByTestId("class-31");

    fireEvent.press(screen.getByRole("button", { name: "Día anterior" }));

    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
    expect(screen.getByText("0 clases")).toBeTruthy();
  });

  it("mientras carga, «Cargando…» y sin contador", () => {
    jest.mocked(scheduleService.getClasses).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(<DaySchedule now={NOW} />);

    expect(screen.getByText("Cargando…")).toBeTruthy();
    expect(screen.getByText("Hoy · lunes 5")).toBeTruthy();
    expect(screen.queryByText(/clases?$/)).toBeNull();
  });

  it("si falla, el error con «Reintentar», que vuelve a pedir", async () => {
    jest.mocked(scheduleService.getClasses).mockRejectedValueOnce(new Error("sin red"));
    renderWithProviders(<DaySchedule now={NOW} />);

    const retry = await screen.findByRole("button", { name: "Reintentar" });
    await act(async () => {
      fireEvent.press(retry);
    });

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(scheduleService.getClasses).toHaveBeenCalledTimes(2);
  });
});
