import { render, screen, within } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { ScheduleClassBlock } from "@/features/schedule/components/ScheduleClassBlock";
import { PAST_OPACITY } from "@/features/schedule/utils/timelineMetrics";
import type { ClassStatus } from "@/features/schedule/utils/classTiming";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const club = { label: "Sede Centro", colors: darkTheme.clubColors[1] };

interface Options {
  status?: ClassStatus;
  height?: number;
  column?: number;
  columns?: number;
}

function setup({ status = "upcoming", height = 80, column = 0, columns = 1 }: Options = {}) {
  render(
    <ScheduleClassBlock
      item={scheduleClass()}
      club={club}
      status={status}
      geometry={{ top: 512, height }}
      placement={{ column, columns }}
    />,
  );
  return StyleSheet.flatten(screen.getByTestId("class-31").props.style);
}

describe("ScheduleClassBlock", () => {
  it("con el color de su club: título, «hora · duración · pista», sede y plazas", () => {
    setup();

    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: club.colors.gradient }));
    expect(screen.getByText("Cantera Tarde")).toBeTruthy();
    expect(screen.getByText("16:00 · 75 min · Pista 1")).toBeTruthy();
    expect(screen.getByText("Sede Centro")).toBeTruthy();
    expect(screen.getByText("3/4")).toBeTruthy();
    expect(screen.getByLabelText(/^Cantera Tarde, 16:00, 75 minutos/)).toBeTruthy();
  });

  it("en su sitio: desde arriba, su alto y su columna", () => {
    expect(setup({ column: 1, columns: 2 })).toMatchObject({ top: 512, height: 80, left: "50%", width: "50%" });
  });

  it("baja, sin sitio para la sede y las plazas", () => {
    setup({ height: 60 });

    expect(screen.queryByTestId("class-31-details")).toBeNull();
    expect(screen.getByText("Cantera Tarde")).toBeTruthy();
  });

  it("la pastilla del club lleva delante un punto de su color", () => {
    setup();

    const dot = within(screen.getByTestId("class-31-club")).getByTestId("club-dot");
    expect(StyleSheet.flatten(dot.props.style)).toMatchObject({ backgroundColor: club.colors.color });
  });

  it("la próxima lleva su marca, un aro claro y el brillo de su club", () => {
    setup({ status: "next" });

    expect(screen.getByTestId("class-31-next")).toBeTruthy();
    const card = StyleSheet.flatten(screen.getByTestId("class-31-card").props.style);
    expect(card).toMatchObject({ borderWidth: 2, shadowColor: club.colors.color, backgroundColor: club.colors.color });
  });

  it("las demás, sin aro ni brillo", () => {
    setup();

    const card = StyleSheet.flatten(screen.getByTestId("class-31-card").props.style);
    expect(card.borderWidth).toBeUndefined();
    expect(card.shadowColor).toBeUndefined();
  });

  it("en curso, sin la marca de próxima", () => {
    setup({ status: "live" });
    expect(screen.queryByTestId("class-31-next")).toBeNull();
  });

  it("si ya terminó, apagada pero visible (para dar el feedback)", () => {
    expect(setup({ status: "past" }).opacity).toBe(PAST_OPACITY);
  });
});
