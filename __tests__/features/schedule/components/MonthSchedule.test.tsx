import { fireEvent, screen } from "@testing-library/react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";

import { MonthSchedule } from "@/features/schedule/components/MonthSchedule";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { wallNow } from "@/features/schedule/utils/scheduleDates";
import { darkTheme } from "@/shared/config/theme";

import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";
import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/services/scheduleService", () =>
  require("../../../helpers/scheduleMocks").scheduleServiceModule(),
);

const mockScrollIntoView = jest.fn();
jest.mock("@/features/schedule/hooks/useScheduleScroll", () => ({
  useScrollIntoView: () => mockScrollIntoView,
}));

// Miércoles 18 de noviembre de 2026 a las 10:00 del teléfono.
const NOW = new Date(2026, 10, 18, 10, 0).getTime();
const TODAY = "2026-11-18";
const clubOf = () => ({ label: "Wave Padel Club", colors: darkTheme.clubColors[2] });
const morning = scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "08:30:00", duration_minutes: 60 });
const evening = scheduleClass({ id: 2, class_date: "2026-11-18", class_time: "19:00:00", duration_minutes: 60 });
const friday = scheduleClass({ id: 3, class_date: "2026-11-20", class_time: "18:00:00" });
// En la cuadrícula del mes pero de diciembre: no entra en la lista de noviembre.
const december = scheduleClass({ id: 4, class_date: "2026-12-02", class_time: "18:00:00" });

// La pantalla guarda el día elegido; aquí, un estado que hace lo mismo.
function Harness() {
  const [date, setDate] = useState(TODAY);
  return (
    <MonthSchedule
      now={NOW}
      nowWall={wallNow(NOW)}
      date={date}
      today={TODAY}
      nextClassId={undefined}
      clubOf={clubOf}
      onSelect={setDate}
    />
  );
}

const headingStyle = (day: string) => StyleSheet.flatten(screen.getByTestId(`month-heading-${day}`).props.style);

describe("MonthSchedule", () => {
  beforeEach(() => {
    signInTeacher();
    mockScrollIntoView.mockClear();
    jest.mocked(scheduleService.getClasses).mockResolvedValue(
      scheduleResponse({ classes: [morning, evening, friday, december] }),
    );
  });

  it("debajo de la cuadrícula, todos los días del mes con clases, con su franja y sus filas", async () => {
    renderWithProviders(<Harness />);

    expect(await screen.findByTestId("month-class-1")).toBeTruthy();
    expect(screen.getByTestId("month-grid")).toBeTruthy();
    expect(screen.getByTestId("month-list-2026-11-18")).toBeTruthy();
    expect(screen.getByTestId("month-list-2026-11-20")).toBeTruthy();
    expect(screen.getByTestId("month-class-2")).toBeTruthy();
    expect(screen.getByTestId("month-class-3")).toBeTruthy();
    // El 2 de diciembre está en la cuadrícula, pero no es de este mes.
    expect(screen.queryByTestId("month-list-2026-12-02")).toBeNull();
  });

  it("la franja de hoy dice «Hoy · hora» y cuántas clases tiene; la del día elegido, resaltada", async () => {
    renderWithProviders(<Harness />);
    await screen.findByTestId("month-class-1");

    expect(screen.getByText("Miércoles, 18 de noviembre")).toBeTruthy();
    expect(screen.getByText("Hoy · 10:00")).toBeTruthy();
    expect(screen.getByText("2 clases")).toBeTruthy();
    expect(headingStyle("2026-11-18").backgroundColor).not.toBe(headingStyle("2026-11-20").backgroundColor);
  });

  it("tocar un día de la cuadrícula lo elige y lleva la lista hasta él, sin volver a pedir", async () => {
    renderWithProviders(<Harness />);
    await screen.findByTestId("month-class-1");

    fireEvent.press(screen.getByTestId("month-day-2026-11-20"));

    expect(mockScrollIntoView).toHaveBeenCalledWith(expect.anything());
    expect(headingStyle("2026-11-20").backgroundColor).not.toBe(headingStyle("2026-11-18").backgroundColor);
    expect(scheduleService.getClasses).toHaveBeenCalledTimes(1);
  });

  it("un día sin clases solo se elige: la lista no se mueve", async () => {
    renderWithProviders(<Harness />);
    await screen.findByTestId("month-class-1");

    fireEvent.press(screen.getByTestId("month-day-2026-11-21"));

    expect(mockScrollIntoView).toHaveBeenCalledWith(null);
  });

  it("un mes sin clases, «Día libre»", async () => {
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [], next_class: null }));
    renderWithProviders(<Harness />);

    expect(await screen.findByText("Día libre · sin compromisos")).toBeTruthy();
  });

  it("mientras carga, la cuadrícula y «Cargando…»; si falla, «Reintentar»", async () => {
    jest.mocked(scheduleService.getClasses).mockRejectedValue(new Error("sin red"));
    renderWithProviders(<Harness />);

    expect(screen.getByTestId("month-grid")).toBeTruthy();
    expect(screen.getByText("Cargando…")).toBeTruthy();
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
  });
});
