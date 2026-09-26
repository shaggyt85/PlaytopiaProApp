import { act, render, screen } from "@testing-library/react-native";
import { Text } from "react-native";

import { changeLanguage } from "@/shared/config/i18n";
import { useTranslation } from "@/shared/hooks/useTranslation";

function Boton() {
  const { t, locale } = useTranslation();
  return (
    <Text>
      {locale}: {t("common.retry")}
    </Text>
  );
}

describe("useTranslation", () => {
  it("vuelve a pintar el componente al cambiar de idioma", async () => {
    render(<Boton />);
    expect(screen.getByText("es: Reintentar")).toBeTruthy();

    await act(() => changeLanguage("en"));

    expect(screen.getByText("en: Retry")).toBeTruthy();
  });
});
