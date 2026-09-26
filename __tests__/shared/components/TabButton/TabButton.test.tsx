import { fireEvent, render, screen } from "@testing-library/react-native";

import { TabButton } from "@/shared/components/TabButton";
import { TABS } from "@/shared/config/tabs";

const [today] = TABS;

describe("TabButton", () => {
  it("se anuncia como pestaña con su nombre y avisa al pulsarla", () => {
    const onPress = jest.fn();
    render(<TabButton tab={today} onPress={onPress} />);

    fireEvent.press(screen.getByRole("tab", { name: "Hoy", selected: false }));

    expect(onPress).toHaveBeenCalled();
  });

  it("la activa se anuncia seleccionada y lleva el degradado de marca", () => {
    render(<TabButton tab={today} isFocused />);

    expect(screen.getByRole("tab", { name: "Hoy", selected: true })).toBeTruthy();
    expect(screen.getByTestId("tab-active-background")).toBeTruthy();
  });

  it("la inactiva no lleva degradado", () => {
    render(<TabButton tab={today} />);

    expect(screen.queryByTestId("tab-active-background")).toBeNull();
  });
});
