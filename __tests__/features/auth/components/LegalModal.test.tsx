import { fireEvent, render, screen } from "@testing-library/react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet } from "react-native";

import { LegalModal } from "@/features/auth/components/LegalModal";
import { t } from "@/shared/config/i18n";

describe("LegalModal", () => {
  it("el cuerpo encoge con la tarjeta para que el texto se pueda desplazar", () => {
    render(<LegalModal document="terms" onClose={jest.fn()} onAccept={jest.fn()} />);

    // Si el degradado no encoge, mide todo el texto y la ScrollView no desplaza.
    const body = screen.UNSAFE_getByType(LinearGradient);
    expect(StyleSheet.flatten(body.props.style)).toMatchObject({ flexShrink: 1 });
    expect(body.findByType(ScrollView)).toBeTruthy();
  });

  it("«Aceptar» avisa a quien lo abrió", () => {
    const onAccept = jest.fn();
    render(<LegalModal document="terms" onClose={jest.fn()} onAccept={onAccept} />);

    fireEvent.press(screen.getByText(t("common.accept")));

    expect(onAccept).toHaveBeenCalledTimes(1);
  });

  it("sin onAccept no ofrece aceptar", () => {
    render(<LegalModal document="privacy" onClose={jest.fn()} />);

    expect(screen.queryByText(t("common.accept"))).toBeNull();
  });

  it("la X lo cierra", () => {
    const onClose = jest.fn();
    render(<LegalModal document="terms" onClose={onClose} />);

    fireEvent.press(screen.getByRole("button", { name: t("common.close") }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
