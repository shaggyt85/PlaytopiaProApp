import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PasswordRecoveryScreen } from "@/features/auth/PasswordRecoveryScreen";
import { passwordRecoveryService } from "@/features/auth/services/passwordRecoveryService";
import { HttpError } from "@/shared/services/HttpError";

import { renderWithProviders } from "../../helpers/renderWithProviders";
import { settle } from "../../helpers/settle";

const mockDismissTo = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ dismissTo: mockDismissTo, back: jest.fn(), canGoBack: () => true }),
}));
jest.mock("@/features/auth/services/passwordRecoveryService", () => ({
  passwordRecoveryService: { requestRecovery: jest.fn() },
}));

const escribir = (email: string) =>
  fireEvent.changeText(screen.getByLabelText("Correo electrónico"), email);
const botonEnviar = () => screen.getByRole("button", { name: "Enviar Correo de Recuperación" });

describe("PasswordRecoveryScreen", () => {
  it("el email empieza vacío y el botón apagado hasta que el email es válido", async () => {
    renderWithProviders(<PasswordRecoveryScreen />);

    expect(screen.getByLabelText("Correo electrónico")).toHaveProp("value", "");
    expect(botonEnviar()).toBeDisabled();

    escribir("ana@club.com");

    await waitFor(() => expect(botonEnviar()).toBeEnabled());
  });

  it("al enviar muestra la confirmación y vuelve al primer paso del acceso", async () => {
    jest.mocked(passwordRecoveryService.requestRecovery).mockResolvedValue({ status: "ok" });
    renderWithProviders(<PasswordRecoveryScreen />);

    escribir(" ana@club.com ");
    await waitFor(() => expect(botonEnviar()).toBeEnabled());
    await act(async () => {
      fireEvent.press(botonEnviar());
    });

    expect(passwordRecoveryService.requestRecovery).toHaveBeenCalledWith("ana@club.com");
    expect(await screen.findByText("¡Correo de recuperación enviado con éxito!")).toBeTruthy();

    fireEvent.press(screen.getByRole("button", { name: "Volver al Login" }));
    expect(mockDismissTo).toHaveBeenCalledWith("/sign-in");
  });

  it("un error se muestra traducido por su status y se queda en el formulario", async () => {
    jest.mocked(passwordRecoveryService.requestRecovery).mockRejectedValue(
      HttpError.fromResponse(429, { type: "about:blank", title: "Too Many Requests", status: 429 }),
    );
    renderWithProviders(<PasswordRecoveryScreen />);

    escribir("ana@club.com");
    await waitFor(() => expect(botonEnviar()).toBeEnabled());
    await act(async () => {
      fireEvent.press(botonEnviar());
    });

    expect(await screen.findByText("Demasiados intentos. Espera un momento.")).toBeTruthy();
    expect(screen.queryByText("¡Correo de recuperación enviado con éxito!")).toBeNull();
  });

  it("al corregir el email desaparece el error anterior", async () => {
    jest.mocked(passwordRecoveryService.requestRecovery).mockRejectedValue(HttpError.network());
    renderWithProviders(<PasswordRecoveryScreen />);

    escribir("ana@club.com");
    await waitFor(() => expect(botonEnviar()).toBeEnabled());
    await act(async () => {
      fireEvent.press(botonEnviar());
    });
    await screen.findByText("Sin conexión. Revisa tu red e inténtalo de nuevo.");

    escribir("ana@club.es");
    await settle();

    expect(screen.queryByText("Sin conexión. Revisa tu red e inténtalo de nuevo.")).toBeNull();
  });
});
