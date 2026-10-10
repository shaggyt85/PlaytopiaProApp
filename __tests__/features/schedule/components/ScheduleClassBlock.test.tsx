import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { ScheduleClassBlock } from "@/features/schedule/components/ScheduleClassBlock";
import type { ClassStatus } from "@/features/schedule/utils/classTiming";
import { PAST_OPACITY } from "@/features/schedule/utils/timelineMetrics";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({ useRouter: () => ({ push: mockPush }) }));

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const club = { label: "Sede Centro", colors: darkTheme.clubColors[1] };
// Su color en el día (por su orden), distinto del de su club.
const colors = darkTheme.clubColors[3];
const hidden = { includeHiddenElements: true };

interface Options {
  status?: ClassStatus;
}

function setup({ status = "upcoming" }: Options = {}) {
  mockGradient.mockClear();
  render(
    <ScheduleClassBlock
      item={scheduleClass()}
      colors={colors}
      club={club}
      status={status}
      geometry={{ top: 512, height: 100 }}
    />,
  );
  return StyleSheet.flatten(screen.getByTestId("class-31").props.style);
}
const gradientColors = () => mockGradient.mock.calls.map(([props]) => props.colors);
const cardStyle = () => StyleSheet.flatten(screen.getByTestId("class-31-card").props.style);

describe("ScheduleClassBlock", () => {
  it("como el prototipo: título, pista y «duración · nivel · plazas», sin el nombre del club", () => {
    setup();

    expect(screen.getByText("Cantera Tarde", hidden)).toBeTruthy();
    expect(screen.getByText("Pista 1", hidden)).toBeTruthy();
    expect(screen.getByText("75 min", hidden)).toBeTruthy();
    expect(screen.getByText("2.5 - 3", hidden)).toBeTruthy();
    expect(screen.getByText("3/4 alumnos", hidden)).toBeTruthy();
    expect(screen.queryByText("Sede Centro", hidden)).toBeNull();
    // El lector de pantalla la sigue leyendo entera, con su club.
    expect(screen.getByLabelText(/^Cantera Tarde, 16:00, 75 minutos/)).toBeTruthy();
  });

  it("sin nivel, no pinta el nivel", () => {
    render(
      <ScheduleClassBlock
        item={scheduleClass({ level_range: null })}
        colors={colors}
        club={club}
        status="upcoming"
        geometry={{ top: 512, height: 100 }}
      />,
    );

    expect(screen.queryByText("2.5 - 3", hidden)).toBeNull();
    expect(screen.getByText("75 min", hidden)).toBeTruthy();
  });

  it("la tarjeta oscura con la franja de su color en el día, no el de su club", () => {
    setup();

    expect(gradientColors()).toEqual(expect.arrayContaining([darkTheme.gradients.classCard, colors.gradient]));
    expect(gradientColors()).not.toContainEqual(club.colors.gradient);
  });

  it("en su sitio: desde arriba, su alto y a todo el ancho", () => {
    expect(setup()).toMatchObject({ top: 512, height: 100, left: 0, right: 0 });
  });

  it("la próxima: «PRÓXIMA», la franja de marca, el aro magenta y su brillo", () => {
    setup({ status: "next" });

    expect(screen.getByTestId("class-31-next", hidden)).toBeTruthy();
    expect(gradientColors()).toContainEqual(darkTheme.gradients.brand);
    expect(gradientColors()).not.toContainEqual(colors.gradient);
    expect(cardStyle().boxShadow).toContain(darkTheme.colors.primary);
  });

  it("las demás, con la sombra de algo que flota y sin brillo magenta", () => {
    setup();

    expect(cardStyle().boxShadow).toBe(darkTheme.shadows.lifted.boxShadow);
  });

  it("en curso: «EN VIVO», sin la marca de próxima", () => {
    setup({ status: "live" });

    expect(screen.getByTestId("class-31-live", hidden)).toBeTruthy();
    expect(screen.queryByTestId("class-31-next", hidden)).toBeNull();
  });

  it("si ya terminó: apagada y «COMPLETADA»", () => {
    expect(setup({ status: "past" }).opacity).toBe(PAST_OPACITY);
    expect(screen.getByTestId("class-31-done", hidden)).toBeTruthy();
    expect(screen.getByText("Completada", hidden)).toBeTruthy();
  });

  it("por venir: sin marca", () => {
    setup();

    expect(screen.queryByTestId(/^class-31-(live|next|done)$/, hidden)).toBeNull();
  });

  it("al tocarla abre su detalle", () => {
    setup();

    fireEvent.press(screen.getByRole("button", { name: /^Cantera Tarde/ }));

    expect(mockPush).toHaveBeenCalledWith({
      pathname: "/class/[dbId]/[classId]",
      params: { dbId: "4", classId: "31", date: "2026-10-05" },
    });
  });
});
