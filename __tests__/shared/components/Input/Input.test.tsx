import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

import { Input } from "@/shared/components/Input";
import { Text } from "@/shared/components/Text";
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
    expect(screen.getByTestId("input-field")).toHaveStyle({
      borderColor: darkTheme.colors.danger,
    });
  });

  it("la variante sólida es la píldora del registro, con borde violeta", () => {
    render(<Input label="Nombre" variant="solid" />);

    expect(screen.getByTestId("input-field")).toHaveStyle({
      backgroundColor: darkTheme.colors.field,
      borderColor: darkTheme.colors.primary,
    });
  });

  it("varias líneas con maxLength: cuenta lo escrito de lo que cabe", () => {
    render(<Input label="Motivo" multiline maxLength={1000} value="Me cambio" />);

    expect(screen.getByTestId("input-counter")).toHaveTextContent("9/1000");
  });

  it("sin maxLength, o en una línea, no hay contador", () => {
    render(
      <>
        <Input label="Motivo" multiline />
        <Input label="Email" maxLength={50} value="ana" />
      </>,
    );

    expect(screen.queryByTestId("input-counter")).toBeNull();
  });

  it("sin error no muestra mensaje", () => {
    render(<Input label="Email" />);

    expect(screen.queryByText("Email no válido")).toBeNull();
  });

  it("muestra el accesorio dentro del campo", () => {
    render(<Input label="Contraseña" rightAccessory={<Text>ojo</Text>} />);

    expect(screen.getByText("ojo")).toBeTruthy();
  });

  it("de varias líneas: el texto arriba y sin el alto fijo de la píldora", () => {
    render(<Input label="Presentación" multiline value="" onChangeText={jest.fn()} />);

    const input = screen.getByLabelText("Presentación");
    expect(input.props.multiline).toBe(true);
    expect(input.props.textAlignVertical).toBe("top");
    expect(StyleSheet.flatten(screen.getByTestId("input-field").props.style).height).toBeUndefined();
  });
});

