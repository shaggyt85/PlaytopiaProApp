import { fireEvent, render, screen } from "@testing-library/react-native";
import { Alert, type AlertButton } from "react-native";

import { SignOutButton } from "@/features/profile/components/SignOutButton";
import { session } from "@/shared/services/session";

jest.mock("@/shared/services/session", () => ({ session: { end: jest.fn().mockResolvedValue(undefined) } }));

/** Pulsa un botón del último `Alert`. */
const pressAlertButton = (text: string) => {
  const buttons = jest.mocked(Alert.alert).mock.calls.at(-1)?.[2] as AlertButton[];
  buttons.find((button) => button.text === text)?.onPress?.();
};

describe("SignOutButton", () => {
  beforeEach(() => jest.spyOn(Alert, "alert").mockImplementation(() => undefined));

  it("pide confirmación antes de cerrar la sesión", () => {
    render(<SignOutButton />);

    fireEvent.press(screen.getByRole("button", { name: "Cerrar sesión" }));

    expect(Alert.alert).toHaveBeenCalledWith("¿Quieres cerrar sesión?", undefined, expect.any(Array));
    expect(session.end).not.toHaveBeenCalled();
  });

  it("al confirmar, cierra la sesión", () => {
    render(<SignOutButton />);
    fireEvent.press(screen.getByRole("button", { name: "Cerrar sesión" }));

    pressAlertButton("Cerrar sesión");

    expect(session.end).toHaveBeenCalledTimes(1);
  });

  it("al cancelar, no", () => {
    render(<SignOutButton />);
    fireEvent.press(screen.getByRole("button", { name: "Cerrar sesión" }));

    pressAlertButton("Cancelar");

    expect(session.end).not.toHaveBeenCalled();
  });
});
