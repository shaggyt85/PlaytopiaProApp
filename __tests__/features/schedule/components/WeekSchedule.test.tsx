import { fireEvent, screen } from "@testing-library/react-native";

import { WeekSchedule } from "@/features/schedule/components/WeekSchedule";
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
const wednesday = scheduleClass({ id: 1, class_date: "2026-11-18", class_time: "16:00:00" });
const friday = scheduleClass({ id: 2, class_date: "2026-11-20", class_time: "18:00:00" });

function setup(date = TODAY) {
  const onSelect = jest.fn();
  renderWithProviders(<WeekSchedule now={NOW} date={date} today={TODAY} clubOf={clubOf} onSelect={onSelect} />);
  return onSelect;
}
const cards = () => screen.queryAllByTestId(/^week-day-/).map((card) => card.props.testID);

describe("WeekSchedule", () => {
  beforeEach(() => {
    useSessionStore.getState().setAuthenticated({ userId: 42, dbId: 7 });
    jest.mocked(scheduleService.getClasses).mockResolvedValue(scheduleResponse({ classes: [wednesday, friday] }));
  });

  it("en la semana actual, de hoy al domingo, con sus clases", async () => {
    setup();

    expect(await screen.findByTestId("week-class-1")).toBeTruthy();
    expect(cards()).toEqual([
      "week-day-2026-11-18",
      "week-day-2026-11-19",
      "week-day-2026-11-20",
      "week-day-2026-11-21",
      "week-day-2026-11-22",
    ]);
    expect(screen.getByTestId("week-class-2")).toBeTruthy();
  });

  it("otra semana, los 7 días", async () => {
    setup("2026-11-25");

    await screen.findAllByTestId(/^week-day-/);
    expect(cards()).toHaveLength(7);
  });

  it("tocar un día lo elige en la agenda y deja solo ese, con su filtro", async () => {
    const onSelect = setup();
    await screen.findByTestId("week-class-1");

    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));

    expect(onSelect).toHaveBeenCalledWith("2026-11-20");
    expect(cards()).toEqual(["week-day-2026-11-20"]);
    expect(screen.getByText("Filtrado por viernes 20")).toBeTruthy();
  });

  it("«Ver toda la semana», tocar hoy o el ya tocado quitan el filtro", async () => {
    setup();
    await screen.findByTestId("week-class-1");

    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));
    fireEvent.press(screen.getByRole("button", { name: "Ver toda la semana" }));
    expect(cards()).toHaveLength(5);

    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));
    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));
    expect(cards()).toHaveLength(5);

    fireEvent.press(screen.getByTestId("week-strip-2026-11-20"));
    fireEvent.press(screen.getByTestId("week-strip-2026-11-18"));
    expect(cards()).toHaveLength(5);
    expect(screen.queryByText(/^Filtrado por/)).toBeNull();
  });

  it("mientras carga, «Cargando…» con la tira ya puesta", () => {
    jest.mocked(scheduleService.getClasses).mockReturnValue(new Promise(() => undefined));
    setup();

    expect(screen.getByText("Cargando…")).toBeTruthy();
    expect(screen.getByTestId("week-strip-2026-11-18")).toBeTruthy();
  });

  it("si falla, el error con «Reintentar»", async () => {
    jest.mocked(scheduleService.getClasses).mockRejectedValue(new Error("sin red"));
    setup();

    expect(await screen.findByRole("button", { name: "Reintentar" })).toBeTruthy();
  });
});
