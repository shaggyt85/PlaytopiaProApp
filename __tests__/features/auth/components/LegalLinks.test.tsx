import { fireEvent, render, screen } from "@testing-library/react-native";

import { LegalLinks, legalSentence } from "@/features/auth/components/LegalLinks";
import { t } from "@/shared/config/i18n";

describe("LegalLinks", () => {
  it("pinta la frase con sus dos enlaces", () => {
    render(<LegalLinks variant="small" />);

    expect(screen.getAllByRole("link").map((link) => link.props.children)).toEqual([
      "condiciones de uso",
      "políticas de privacidad",
    ]);
  });

  it("cada enlace abre el resumen de su documento", () => {
    render(<LegalLinks variant="label" />);

    fireEvent.press(screen.getByText("políticas de privacidad"));

    expect(screen.getByText("Política de Privacidad")).toBeTruthy();
  });

  it("la frase entera en texto plano, para lectores de pantalla", () => {
    expect(legalSentence(t)).toBe(
      "Al registrarte aceptas nuestras condiciones de uso y políticas de privacidad",
    );
  });
});
