import { fireEvent, render, screen } from "@testing-library/react-native";

import { Checkbox } from "@/shared/components/Checkbox";
import { darkTheme } from "@/shared/config/theme";

describe("Checkbox", () => {
  it("al pulsarla avisa con el valor contrario", () => {
    const onChange = jest.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        Acepto
      </Checkbox>,
    );

    fireEvent.press(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("marcada muestra el ✓, se anuncia como marcada y se rellena de su color", () => {
    render(
      <Checkbox checked onChange={jest.fn()} tone="option">
        Prefiero no decirlo
      </Checkbox>,
    );

    expect(screen.getByText("✓")).toBeTruthy();
    expect(screen.getByRole("checkbox", { checked: true })).toHaveStyle({
      backgroundColor: darkTheme.colors.option,
    });
  });

  it("sin marcar no muestra el ✓", () => {
    render(
      <Checkbox checked={false} onChange={jest.fn()}>
        Acepto
      </Checkbox>,
    );

    expect(screen.queryByText("✓")).toBeNull();
  });
});
