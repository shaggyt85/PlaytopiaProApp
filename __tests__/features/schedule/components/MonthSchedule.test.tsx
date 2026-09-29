import { fireEvent, screen } from "@testing-library/react-native";
import { useState } from "react";

import { MonthSchedule } from "@/features/schedule/components/MonthSchedule";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { darkTheme } from "@/shared/config/theme";
import { useSessionStore } from "@/shared/store/sessionStore";

import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/services/scheduleService", () => ({
  ...jest.requireActual("@/features/schedule/services/scheduleService"),
  scheduleService: { getClasses: jest.fn() },
}));

// Miércoles 18 de noviembre de 2026 a las 10:00 del teléfono.
const NOW = new Date(2026, 10, 18, 10, 0).getTime();
const TODAY = "2026-11-18";
const clubOf = () => ({ label: "Wave Padel Club", colors: darkTheme.clubColors[2] });
const morning = scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "08:30:00", duration_minutes: 60 });
const evening = scheduleClass({ id: 2, class_date: "2026-11-18", class_time: "19:00:00", duration_minutes: 60 });
const friday = scheduleClass({ id: 3, class_date: "2026-11-20", class_time: "18:00:00" });

// La pantalla guarda el día elegido; aquí, un estado que hace lo mismo.
function Harness() {
  const [date, setDate] = useState(TODAY);
  return <MonthSchedule now={NOW} date={date} today={TODAY} clubOf={clubOf} onSelect={setDate} />;
}

describe("MonthSchedule", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [morning, evening, friday] }));
  });

  it("la cuadrícula y, debajo, «Hoy · 18 de noviembre» con sus clases", async () => {
    renderWithProviders(<Harness />);

    expect(await screen.findByTestId("month-class-1")).toBeTruthy();
    expect(screen.getByTestId("month-grid")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Hoy · 18 de noviembre" })).toBeTruthy();
    expect(screen.getByTestId("month-class-2")).toBeTruthy();
  });

  it("tocar otro día enseña sus clases, sin volver a pedir", async () => {
    renderWithProviders(<Harness />);
    await screen.findByTestId("month-class-1");

    fireEvent.press(screen.getByTestId("month-day-2026-11-20"));

    expect(screen.getByRole("header", { name: "20 de noviembre" })).toBeTruthy();
    expect(screen.getByTestId("month-class-3")).toBeTruthy();
    expect(screen.queryByTestId("month-class-1")).toBeNull();
    expect(scheduleService.getClasses).toHaveBeenCalledTimes(1);
  });

  it("un día sin clases, «Día libre»", async () => {
    renderWithProviders(<Harness />);
    await screen.findByTestId("month-class-1");

    fireEvent.press(screen.getByTestId("month-day-2026-11-21"));

    expect(screen.getByText("Día libre · sin compromisos")).toBeTruthy();
  });

  it("mientras carga, la cuadrícula y «Cargando…»; si falla, «Reintentar»", async () => {
    jest.mocked(scheduleService.getClasses).mockRejectedValue(new Error("sin red"));
    renderWithProviders(<Harness />);

    expect(screen.getByTestId("month-grid")).toBeTruthy();
    expect(screen.getByText("Cargando…")).toBeTruthy();
    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
  });
});
