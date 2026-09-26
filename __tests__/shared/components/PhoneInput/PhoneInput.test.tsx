import { fireEvent, render, screen } from "@testing-library/react-native";

import { PhoneInput } from "@/shared/components/PhoneInput";
import { darkTheme } from "@/shared/config/theme";

const renderPhone = (props: Partial<Parameters<typeof PhoneInput>[0]> = {}) =>
  render(
    <PhoneInput
      country="ES"
      onCountryChange={jest.fn()}
      value=""
      onChangeText={jest.fn()}
      {...props}
    />,
  );

describe("PhoneInput", () => {
  it("el botón del país muestra bandera y prefijo", () => {
    renderPhone();

    expect(screen.getByText("🇪🇸")).toBeTruthy();
    expect(screen.getByText("+34")).toBeTruthy();
  });

  it("se encuentra por su etiqueta y avisa al escribir el número", () => {
    const onChangeText = jest.fn();
    renderPhone({ onChangeText });

    fireEvent.changeText(screen.getByLabelText("Número de teléfono"), "612345678");

    expect(onChangeText).toHaveBeenCalledWith("612345678");
  });

  it("elegir otro país en la lista avisa con su código y cierra la lista", () => {
    const onCountryChange = jest.fn();
    renderPhone({ onCountryChange });

    fireEvent.press(screen.getByRole("button", { name: "España +34" }));
    expect(screen.getByText("Selecciona tu país")).toBeTruthy();

    fireEvent.press(screen.getByRole("button", { name: "Argentina +54" }));

    expect(onCountryChange).toHaveBeenCalledWith("AR");
    expect(screen.queryByText("Selecciona tu país")).toBeNull();
  });

  it("la lista se filtra por prefijo, con o sin +", () => {
    renderPhone();
    fireEvent.press(screen.getByRole("button", { name: "España +34" }));

    fireEvent.changeText(screen.getByLabelText("Buscar país o prefijo"), "+54");

    expect(screen.getByRole("button", { name: "Argentina +54" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Alemania +49" })).toBeNull();
  });

  it("al cerrar y reabrir la lista, la búsqueda anterior ya no está", () => {
    renderPhone();
    fireEvent.press(screen.getByRole("button", { name: "España +34" }));
    fireEvent.changeText(screen.getByLabelText("Buscar país o prefijo"), "zzz");

    fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));
    fireEvent.press(screen.getByRole("button", { name: "España +34" }));

    expect(screen.getByLabelText("Buscar país o prefijo")).toHaveProp("value", "");
    expect(screen.getByRole("button", { name: "Argentina +54" })).toBeTruthy();
  });

  it("si nada coincide lo dice", () => {
    renderPhone();
    fireEvent.press(screen.getByRole("button", { name: "España +34" }));

    fireEvent.changeText(screen.getByLabelText("Buscar país o prefijo"), "zzz");

    expect(screen.getByText("Ningún país coincide con la búsqueda")).toBeTruthy();
  });

  it("con error lo muestra y marca el campo en rojo", () => {
    renderPhone({ error: "El teléfono debe tener al menos 9 dígitos" });

    expect(screen.getByText("El teléfono debe tener al menos 9 dígitos")).toBeTruthy();
    expect(screen.getByTestId("phone-input-field")).toHaveStyle({
      borderColor: darkTheme.colors.danger,
    });
  });
});
