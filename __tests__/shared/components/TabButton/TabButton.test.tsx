import { fireEvent, render, screen } from "@testing-library/react-native";

import { TabButton } from "@/shared/components/TabButton";
import { TABS } from "@/shared/config/tabs";
import { selectionFeedback } from "@/shared/utils/haptics";

jest.mock("@/shared/utils/haptics", () => ({ selectionFeedback: jest.fn() }));

const [agenda] = TABS;

describe("TabButton", () => {
  it("se anuncia como pestaña con su nombre", () => {
    render(<TabButton tab={agenda} />);

    expect(screen.getByRole("tab", { name: "Agenda", selected: false })).toBeTruthy();
  });

  it("la activa se anuncia seleccionada", () => {
    render(<TabButton tab={agenda} isFocused />);

    expect(screen.getByRole("tab", { name: "Agenda", selected: true })).toBeTruthy();
  });

  it("el icono va encima del nombre aunque TabTrigger le pase su estilo en fila", () => {
    render(<TabButton tab={agenda} style={{ flexDirection: "row", justifyContent: "space-between" }} />);

    expect(screen.getByRole("tab", { name: "Agenda" })).toHaveStyle({
      flexDirection: "column",
      justifyContent: "center",
    });
  });

  it("al cambiar a otra pestaña vibra y navega", () => {
    const onPress = jest.fn();
    render(<TabButton tab={agenda} onPress={onPress} />);

    fireEvent.press(screen.getByRole("tab", { name: "Agenda" }));

    expect(selectionFeedback).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalled();
  });

  it("al tocar la pestaña que ya está activa no vibra", () => {
    const onPress = jest.fn();
    render(<TabButton tab={agenda} isFocused onPress={onPress} />);

    fireEvent.press(screen.getByRole("tab", { name: "Agenda" }));

    expect(selectionFeedback).not.toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
  });
});
