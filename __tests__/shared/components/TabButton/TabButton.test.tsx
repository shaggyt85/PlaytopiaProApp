import { fireEvent, render, screen } from "@testing-library/react-native";

import { TabButton } from "@/shared/components/TabButton";
import { TABS } from "@/shared/config/tabs";
import { selectionFeedback } from "@/shared/utils/haptics";

jest.mock("@/shared/utils/haptics", () => ({ selectionFeedback: jest.fn() }));

const [today] = TABS;

describe("TabButton", () => {
  it("se anuncia como pestaña con su nombre", () => {
    render(<TabButton tab={today} />);

    expect(screen.getByRole("tab", { name: "Hoy", selected: false })).toBeTruthy();
  });

  it("la activa se anuncia seleccionada", () => {
    render(<TabButton tab={today} isFocused />);

    expect(screen.getByRole("tab", { name: "Hoy", selected: true })).toBeTruthy();
  });

  it("el icono va encima del nombre aunque TabTrigger le pase su estilo en fila", () => {
    render(<TabButton tab={today} style={{ flexDirection: "row", justifyContent: "space-between" }} />);

    expect(screen.getByRole("tab", { name: "Hoy" })).toHaveStyle({
      flexDirection: "column",
      justifyContent: "center",
    });
  });

  it("al cambiar a otra pestaña vibra y navega", () => {
    const onPress = jest.fn();
    render(<TabButton tab={today} onPress={onPress} />);

    fireEvent.press(screen.getByRole("tab", { name: "Hoy" }));

    expect(selectionFeedback).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalled();
  });

  it("al tocar la pestaña que ya está activa no vibra", () => {
    const onPress = jest.fn();
    render(<TabButton tab={today} isFocused onPress={onPress} />);

    fireEvent.press(screen.getByRole("tab", { name: "Hoy" }));

    expect(selectionFeedback).not.toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
  });
});
