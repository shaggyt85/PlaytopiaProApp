import { fireEvent, render, screen } from "@testing-library/react-native";

import { AttendanceToggle } from "@/features/schedule/components/AttendanceToggle";
import { darkTheme } from "@/shared/config/theme";

const mockGradient = jest.fn();
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: (props: Record<string, unknown>) => {
    mockGradient(props);
    return null;
  },
}));

const renderToggle = (props: Partial<Parameters<typeof AttendanceToggle>[0]> = {}) =>
  render(
    <AttendanceToggle status="present" selected={false} onPress={jest.fn()} accessibilityLabel="Marcar presente a Lucía Romero" {...props} />,
  );

describe("AttendanceToggle", () => {
  it("sin elegir, gris y sin degradado; el lector dice qué hace y que no está elegido", () => {
    renderToggle();

    const button = screen.getByRole("button", { name: "Marcar presente a Lucía Romero" });
    expect(button.props.accessibilityState).toMatchObject({ selected: false });
    expect(button).toHaveStyle({ backgroundColor: darkTheme.colors.surfaceStrong });
    expect(mockGradient).not.toHaveBeenCalled();
  });

  it("presente elegido: el degradado de marca en relieve", () => {
    renderToggle({ selected: true });

    expect(screen.getByRole("button").props.accessibilityState).toMatchObject({ selected: true });
    expect(screen.getByRole("button")).toHaveStyle(darkTheme.shadows.raised);
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.gradients.brand }));
  });

  it("ausente elegido: el coral en relieve", () => {
    renderToggle({ status: "absent", selected: true, accessibilityLabel: "Marcar ausente a Lucía Romero" });

    expect(screen.getByRole("button")).toHaveStyle(darkTheme.shadows.raisedCoral);
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.accents.coral.gradient }));
  });

  it("pasado el plazo, la marca a la vista, atenuada; tocarlo sigue avisando (para decir por qué)", () => {
    const onPress = jest.fn();
    renderToggle({ selected: true, locked: true, onPress });

    const button = screen.getByRole("button");
    expect(button.props.accessibilityState).toMatchObject({ selected: true });
    expect(button).toHaveStyle({ opacity: 0.5 });
    expect(mockGradient).toHaveBeenCalledWith(expect.objectContaining({ colors: darkTheme.gradients.brand }));
    fireEvent.press(button);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("al tocarlo, avisa", () => {
    const onPress = jest.fn();
    renderToggle({ onPress });

    fireEvent.press(screen.getByRole("button"));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
