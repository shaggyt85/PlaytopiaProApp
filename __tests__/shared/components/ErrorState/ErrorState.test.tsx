import { fireEvent, render, screen } from "@testing-library/react-native";

import { ErrorState } from "@/shared/components/ErrorState";
import { changeLanguage } from "@/shared/config/i18n";
import { HttpError } from "@/shared/services/HttpError";

describe("ErrorState", () => {
  beforeEach(async () => {
    await changeLanguage("es");
  });

  it("muestra el texto traducido del error", () => {
    render(<ErrorState error={HttpError.network()} />);

    expect(
      screen.getByText("Sin conexión. Revisa tu red e inténtalo de nuevo."),
    ).toBeTruthy();
  });

  it("con onRetry ofrece Reintentar", () => {
    const onRetry = jest.fn();
    render(<ErrorState error={HttpError.timeout()} onRetry={onRetry} />);

    fireEvent.press(screen.getByRole("button", { name: "Reintentar" }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("sin onRetry no hay botón", () => {
    render(<ErrorState error={new Error("x")} />);

    expect(screen.queryByRole("button")).toBeNull();
  });
});
