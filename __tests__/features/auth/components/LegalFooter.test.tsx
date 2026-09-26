import { act, fireEvent, render, screen } from "@testing-library/react-native";
import { Linking } from "react-native";

import { LegalFooter } from "@/features/auth/components/LegalFooter";

describe("LegalFooter", () => {
  it("los enlaces abren el resumen de condiciones y de privacidad", () => {
    render(<LegalFooter />);

    fireEvent.press(screen.getByText("condiciones de uso"));
    expect(screen.getByText("Términos y Condiciones")).toBeTruthy();

    fireEvent.press(screen.getAllByRole("button", { name: "Cerrar" })[0]);
    expect(screen.queryByText("Términos y Condiciones")).toBeNull();

    fireEvent.press(screen.getByText("políticas de privacidad"));
    expect(screen.getByText("Política de Privacidad")).toBeTruthy();
  });

  it("Ver Documento Completo abre el documento en la web", async () => {
    const openURL = jest.spyOn(Linking, "openURL").mockResolvedValue(true);
    render(<LegalFooter />);

    fireEvent.press(screen.getByText("condiciones de uso"));
    // El botón queda ocupado mientras se abre el enlace: se espera a que acabe.
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Ver Documento Completo" }));
    });

    expect(openURL).toHaveBeenCalledWith("https://playtopiax.com/legal/");
  });
});
