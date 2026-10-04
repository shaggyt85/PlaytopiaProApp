import { act, fireEvent, screen } from "@testing-library/react-native";

import { DaySchedule } from "@/features/schedule/components/DaySchedule";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { wallNow } from "@/features/schedule/utils/scheduleDates";
import { darkTheme } from "@/shared/config/theme";

import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";
import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/services/scheduleService", () =>
  require("../../../helpers/scheduleMocks").scheduleServiceModule(),
);

// Lunes 5 de octubre de 2026 a las 15:21 del teléfono.
const NOW = new Date(2026, 9, 5, 15, 21).getTime();
const TODAY = "2026-10-05";
const cantera = scheduleClass({ id: 31, class_date: "2026-10-05", class_time: "16:00:00" });
const clubOf = () => ({ label: "Sede Centro", colors: darkTheme.clubColors[0] });

// La próxima llega de la pantalla (`useNextClass`), no de la respuesta del mes.
const view = (date = TODAY) => (
  <DaySchedule
    now={NOW}
    nowWall={wallNow(NOW)}
    date={date}
    today={TODAY}
    nextClassId={31}
    clubOf={clubOf}
    onSelect={jest.fn()}
  />
);

describe("DaySchedule", () => {
  beforeEach(() => {
    signInTeacher();
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [cantera], next_class: null }));
  });

  it("hoy: directamente la tira con sus clases y la próxima marcada, sin pastilla ni contador", async () => {
    renderWithProviders(view());

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(screen.getByTestId("class-31-next")).toBeTruthy();
    expect(screen.queryByText("Hoy · lunes 5")).toBeNull();
    expect(screen.queryByText("1 clase")).toBeNull();
  });

  it("otro día sin clases: «Día libre»", async () => {
    renderWithProviders(view("2026-10-06"));

    expect(await screen.findByText("Día libre · sin compromisos")).toBeTruthy();
  });

  it("mientras carga, «Cargando…»", () => {
    jest.mocked(scheduleService.getClasses).mockReturnValue(new Promise(() => undefined));
    renderWithProviders(view());

    expect(screen.getByText("Cargando…")).toBeTruthy();
  });

  it("si falla, el error con «Reintentar», que vuelve a pedir", async () => {
    jest.mocked(scheduleService.getClasses).mockRejectedValueOnce(new Error("sin red"));
    renderWithProviders(view());

    const retry = await screen.findByRole("button", { name: "Reintentar" });
    await act(async () => {
      fireEvent.press(retry);
    });

    expect(await screen.findByTestId("class-31")).toBeTruthy();
    expect(scheduleService.getClasses).toHaveBeenCalledTimes(2);
  });
});
