import { fireEvent, render, screen } from "@testing-library/react-native";

import { PasswordInput } from "@/features/auth/components/PasswordInput";

describe("PasswordInput", () => {
  it("oculta la contraseña y permite mostrarla y volver a ocultarla", () => {
    render(<PasswordInput label="Contraseña" />);
    const campo = () => screen.getByLabelText("Contraseña");

    expect(campo().props.secureTextEntry).toBe(true);

    fireEvent.press(screen.getByRole("button", { name: "Mostrar contraseña" }));
    expect(campo().props.secureTextEntry).toBe(false);

    fireEvent.press(screen.getByRole("button", { name: "Ocultar contraseña" }));
    expect(campo().props.secureTextEntry).toBe(true);
  });
});
