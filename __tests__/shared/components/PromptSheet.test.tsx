import { IconLoSparkles } from "@playtopia/icons/react-native";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { PromptSheet } from "@/shared/components/PromptSheet";

describe("PromptSheet", () => {
  const props = () => ({
    visible: true,
    onClose: jest.fn(),
    Icon: IconLoSparkles,
    title: "Hay una versión nueva",
    subtitle: "Actualiza para tener lo último",
    primary: { title: "Actualizar", onPress: jest.fn() },
    secondary: { title: "Ahora no", onPress: jest.fn() },
  });

  it("su título como cabecera, el subtítulo y lo propio de la oferta", () => {
    render(
      <PromptSheet {...props()}>
        <Text>Acceso instantáneo</Text>
      </PromptSheet>,
    );

    expect(screen.getByRole("header", { name: "Hay una versión nueva" })).toBeTruthy();
    expect(screen.getByText("Actualiza para tener lo último")).toBeTruthy();
    expect(screen.getByText("Acceso instantáneo")).toBeTruthy();
  });

  it("cada botón hace lo suyo", () => {
    const p = props();
    render(<PromptSheet {...p} />);

    fireEvent.press(screen.getByRole("button", { name: "Actualizar" }));
    fireEvent.press(screen.getByRole("button", { name: "Ahora no" }));

    expect(p.primary.onPress).toHaveBeenCalledTimes(1);
    expect(p.secondary.onPress).toHaveBeenCalledTimes(1);
  });

  it("sin botón secundario, solo el principal", () => {
    const { secondary: _none, ...p } = props();
    render(<PromptSheet {...p} />);

    expect(screen.queryByRole("button", { name: "Ahora no" })).toBeNull();
  });
});
