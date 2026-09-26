import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { checkEmailService } from "@/features/auth/services/checkEmailService";
import { SignInScreen } from "@/features/auth/SignInScreen";
import { useAuthFlowStore } from "@/features/auth/store/authFlowStore";
import { HttpError } from "@/shared/services/HttpError";

import { renderWithProviders } from "../../helpers/renderWithProviders";

const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
}));
jest.mock("@/features/auth/services/checkEmailService", () => ({
  checkEmailService: { checkEmail: jest.fn() },
}));

const escribirYContinuar = (email: string) => {
  fireEvent.changeText(screen.getByLabelText("Correo electrónico"), email);
  fireEvent.press(screen.getByRole("button", { name: "Continuar" }));
};

describe("SignInScreen", () => {
  beforeEach(() => {
    useAuthFlowStore.getState().reset();
  });

  it("si el email existe, lo guarda para el paso 2 y va a la contraseña", async () => {
    jest.mocked(checkEmailService.checkEmail).mockResolvedValue({
      email: "ana@club.com",
      exists: true,
      is_student: true,
    });
    renderWithProviders(<SignInScreen />);

    escribirYContinuar(" ana@club.com ");

    await waitFor(() => expect(mockPush).toHaveBeenCalledWith("/password"));
    expect(checkEmailService.checkEmail).toHaveBeenCalledWith("ana@club.com");
    expect(useAuthFlowStore.getState()).toMatchObject({
      email: "ana@club.com",
      isStudent: true,
    });
  });

  it("si no existe, el botón pasa a Registrarse y lleva al registro", async () => {
    jest.mocked(checkEmailService.checkEmail).mockResolvedValue({
      email: "nuevo@club.com",
      exists: false,
      is_student: false,
    });
    renderWithProviders(<SignInScreen />);

    escribirYContinuar("nuevo@club.com");

    await screen.findByText("Correo no encontrado. Verifica tu correo o regístrate");
    // Como en la app de alumnos, el mismo botón pasa a "Registrarse".
    fireEvent.press(screen.getByRole("button", { name: "Registrarse" }));
    expect(mockPush).toHaveBeenCalledWith("/sign-up");
  });

  it("valida el email antes de llamar a Core", async () => {
    renderWithProviders(<SignInScreen />);

    escribirYContinuar("ana@");

    await screen.findByText("El correo electrónico no es válido");
    expect(checkEmailService.checkEmail).not.toHaveBeenCalled();
  });

  it("un fallo de red se muestra traducido", async () => {
    jest.mocked(checkEmailService.checkEmail).mockRejectedValue(HttpError.network());
    renderWithProviders(<SignInScreen />);

    escribirYContinuar("ana@club.com");

    await screen.findByText("Sin conexión. Revisa tu red e inténtalo de nuevo.");
    expect(mockPush).not.toHaveBeenCalled();
  });
});
