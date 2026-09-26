import { fireEvent, render, screen } from "@testing-library/react-native";

import { Input } from "@/shared/components/Input";
import { darkTheme } from "@/shared/config/theme";

describe("Input", () => {
  it("se encuentra por su etiqueta y avisa al escribir", () => {
    const onChangeText = jest.fn();
    render(<Input label="Email" onChangeText={onChangeText} />);

    fireEvent.changeText(screen.getByLabelText("Email"), "ana@club.com");

    expect(onChangeText).toHaveBeenCalledWith("ana@club.com");
  });

  it("muestra el error y marca el borde en rojo", () => {
    render(<Input label="Email" error="Email no válido" />);

    expect(screen.getByText("Email no válido")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toHaveStyle({
      borderColor: darkTheme.colors.danger,
    });
  });

  it("sin error no muestra mensaje", () => {
    render(<Input label="Email" />);

    expect(screen.queryByText("Email no válido")).toBeNull();
  });
});
