import { QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, screen } from "@testing-library/react-native";
import { AccessibilityInfo } from "react-native";

import { ScheduleAgenda } from "@/features/schedule/components/ScheduleAgenda";
import { scheduleService } from "@/features/schedule/services/scheduleService";
import { darkTheme } from "@/shared/config/theme";

import { renderWithProviders } from "../../../helpers/renderWithProviders";
import { signInTeacher } from "../../../helpers/scheduleMocks";
import { scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/services/scheduleService", () =>
  require("../../../helpers/scheduleMocks").scheduleServiceModule(),
);

// Cuenta cuántas veces se pinta cada día (tira y mes), para ver que el reloj no los repinta.
const mockDayRenders = { count: 0 };
jest.mock("@/features/schedule/components/DayButton", () => {
  const actual = jest.requireActual<typeof import("@/features/schedule/components/DayButton")>(
    "@/features/schedule/components/DayButton",
  );
  const { createElement, memo } = jest.requireActual<typeof import("react")>("react");
  const Counted = memo((props: Parameters<typeof actual.DayButton>[0]) => {
    mockDayRenders.count += 1;
    return createElement(actual.DayButton, props);
  });
  return { ...actual, DayButton: Counted };
});

// Miércoles 18 de noviembre de 2026 a las 10:00 del teléfono.
const NOW = new Date(2026, 10, 18, 10, 0).getTime();
const TODAY = "2026-11-18";
const wave = { label: "Wave Padel Club", colors: darkTheme.clubColors[2] };
const clubOf = () => wave;
const wednesday = scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "16:00:00" });
const friday = scheduleClass({ id: 2, class_date: "2026-11-20", class_time: "18:00:00" });

function setup(now = NOW) {
  return renderWithProviders(<ScheduleAgenda now={now} today={TODAY} nextClassId={1} clubOf={clubOf} />);
}
const pressView = (name: string) => fireEvent.press(screen.getByRole("tab", { name }));
/** El texto del centro de la barra (‹ Hoy ›). */
const current = () => screen.getByTestId("schedule-today").props.accessibilityLabel as string;

describe("ScheduleAgenda", () => {
  beforeEach(() => {
    signInTeacher();
    mockDayRenders.count = 0;
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [wednesday, friday] }));
  });

  it("empieza en Día, hoy, con «MI AGENDA», la barra y las pestañas; sin leyenda de clubes", async () => {
    setup();

    expect(await screen.findByTestId("class-1")).toBeTruthy();
    expect(screen.getByRole("header", { name: "Mi agenda" })).toBeTruthy();
    expect(current()).toBe("Hoy");
    expect(screen.getByRole("tab", { name: "Día" }).props.accessibilityState).toEqual({ selected: true });
    expect(screen.queryByTestId("club-legend")).toBeNull();
  });

  it("el selector cambia a Semana y a Mes, sin volver a pedir", async () => {
    setup();
    await screen.findByTestId("class-1");

    pressView("Semana");
    expect(screen.getByTestId("week-strip-2026-11-18")).toBeTruthy();
    expect(current()).toBe("16 nov – 22 nov");

    pressView("Mes");
    expect(screen.getByTestId("month-grid")).toBeTruthy();
    expect(current()).toBe("Noviembre de 2026");
    expect(scheduleService.getClasses).toHaveBeenCalledTimes(1);
  });

  it("las flechas mueven un día, una semana o un mes según la vista", async () => {
    setup();
    await screen.findByTestId("class-1");

    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));
    expect(current()).toMatch(/^Jue\.? 19 nov\.?$/);

    pressView("Semana");
    fireEvent.press(screen.getByRole("button", { name: "Semana siguiente" }));
    expect(current()).toBe("23 nov – 29 nov");

    pressView("Mes");
    fireEvent.press(screen.getByRole("button", { name: "Mes siguiente" }));
    expect(current()).toBe("Diciembre de 2026");
  });

  it("tocar el texto del centro vuelve a hoy", async () => {
    setup();
    await screen.findByTestId("class-1");
    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));
    fireEvent.press(screen.getByRole("button", { name: "Día siguiente" }));

    fireEvent.press(screen.getByTestId("schedule-today"));

    expect(current()).toBe("Hoy");
    expect(screen.getByTestId("class-1")).toBeTruthy();
  });

  it("tocar un día en Semana y pasar a Día enseña ese día", async () => {
    setup();
    await screen.findByTestId("class-1");

    pressView("Semana");
    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));
    pressView("Día");

    expect(current()).toMatch(/^Vie\.? 20 nov\.?$/);
    expect(screen.getByTestId("class-2")).toBeTruthy();
  });

  it("anuncia la vista nueva al cambiar", async () => {
    const announce = jest.spyOn(AccessibilityInfo, "announceForAccessibility").mockImplementation(() => undefined);
    setup();
    await screen.findByTestId("class-1");

    pressView("Mes");

    expect(announce).toHaveBeenCalledWith("noviembre de 2026");
    announce.mockRestore();
  });

  it("cuando avanza el reloj, los días de la tira no se vuelven a pintar", async () => {
    const { rerender, client } = setup();
    await screen.findByTestId("class-1");
    pressView("Semana");
    const before = mockDayRenders.count;

    rerender(
      <QueryClientProvider client={client}>
        <ScheduleAgenda now={NOW + 60_000} today={TODAY} nextClassId={1} clubOf={clubOf} />
      </QueryClientProvider>,
    );

    expect(current()).toBe("16 nov – 22 nov");
    expect(mockDayRenders.count).toBe(before);
  });
});
