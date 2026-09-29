import { render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { DayTimeline } from "@/features/schedule/components/DayTimeline";
import { PAST_OPACITY } from "@/features/schedule/components/ScheduleClassBlock/ScheduleClassBlock.styles";
import { useForegroundNow } from "@/features/schedule/hooks/useForegroundNow";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

jest.mock("@/features/schedule/hooks/useForegroundNow", () => ({ useForegroundNow: jest.fn() }));

const hidden = { includeHiddenElements: true };
// 5 de octubre a las 16:30 del teléfono.
const now = new Date(2026, 9, 5, 16, 30).getTime();
const on5 = (id: number, class_time: string, duration_minutes = 60) =>
  scheduleClass({ id, class_date: "2026-10-05", class_time, duration_minutes });

const morning = on5(1, "09:00:00");
const live = on5(2, "16:00:00", 75);
const next = on5(3, "18:00:00");
const sameTime = on5(4, "18:00:00");
const clubOf = () => ({ label: "Sede Centro", colors: darkTheme.clubColors[0] });

const styleOf = (id: number) => StyleSheet.flatten(screen.getByTestId(`class-${id}`).props.style);

function setup(classes = [morning, live, next, sameTime], isToday = true) {
  render(<DayTimeline classes={classes} isToday={isToday} nextClassId={next.id} clubOf={clubOf} />);
}

describe("DayTimeline", () => {
  beforeEach(() => jest.mocked(useForegroundNow).mockReturnValue(now));

  it("pide la hora cada minuto", () => {
    setup();

    expect(useForegroundNow).toHaveBeenCalledWith({ everyMinute: true });
  });

  it("cada clase a su hora; las que coinciden, lado a lado", () => {
    setup();

    expect(styleOf(1)).toMatchObject({ top: 64, height: 64, left: "0%", width: "100%" });
    expect(styleOf(3)).toMatchObject({ top: 640, left: "0%", width: "50%" });
    expect(styleOf(4)).toMatchObject({ top: 640, left: "50%", width: "50%" });
  });

  it("cada una con su estado: la que terminó apagada y la próxima marcada", () => {
    setup();

    expect(styleOf(1).opacity).toBe(PAST_OPACITY);
    expect(styleOf(2).opacity).toBeUndefined();
    expect(screen.getByLabelText(/en curso$/)).toBeTruthy();
    expect(screen.getByTestId("class-3-next")).toBeTruthy();
    expect(screen.queryByTestId("class-4-next")).toBeNull();
  });

  it("hoy, la línea de ahora a su hora", () => {
    setup();

    expect(StyleSheet.flatten(screen.getByTestId("now-line", hidden).props.style).top).toBe(8.5 * 64);
    expect(screen.getByText("16:30", hidden)).toBeTruthy();
  });

  it("otro día, sin línea de ahora", () => {
    setup(undefined, false);

    expect(screen.queryByTestId("now-line", hidden)).toBeNull();
  });

  it("la franja se amplía para una clase fuera de ella", () => {
    setup([on5(5, "06:30:00")]);

    expect(screen.getByTestId("hour-6", hidden)).toBeTruthy();
    expect(styleOf(5).top).toBe(32);
  });
});
