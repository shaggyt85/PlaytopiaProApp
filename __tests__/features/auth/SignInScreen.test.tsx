import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { biometricService } from "@/features/auth/services/biometricService";
import { checkEmailService } from "@/features/auth/services/checkEmailService";
import { completeSignIn } from "@/features/auth/services/completeSignIn";
import { SignInScreen } from "@/features/auth/SignInScreen";
import { useAuthFlowStore } from "@/features/auth/store/authFlowStore";
import { HttpError } from "@/shared/services/HttpError";
import { requestTokenRefresh } from "@/shared/services/tokenRefresh";
import { useSessionStore } from "@/shared/store/sessionStore";

import { renderWithProviders } from "../../helpers/renderWithProviders";

const mockPush = jest.fn();
// Guarda lo que la pantalla hace al recibir el foco, para simular que se vuelve a ella.
let mockOnFocus: (() => void) | undefined;
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: jest.fn() }),
  useFocusEffect: (effect: () => void) => {
    mockOnFocus = effect;
  },
}));
jest.mock("@/features/auth/services/checkEmailService", () => ({
  checkEmailService: { checkEmail: jest.fn() },
}));
// Sin biometría por defecto; los casos de biometría la activan.
jest.mock("@/features/auth/services/biometricService", () => ({
  biometricService: require("../../helpers/biometricServiceMock").createBiometricServiceMock(),
}));
jest.mock("@/features/auth/services/completeSignIn", () => ({ completeSignIn: jest.fn() }));
jest.mock("@/shared/services/tokenRefresh", () => ({
  ...jest.requireActual("@/shared/services/tokenRefresh"),
  requestTokenRefresh: jest.fn(),
}));

const escribirYContinuar = (email: string) => {
  fireEvent.changeText(screen.getByLabelText("Correo electrónico"), email);
  fireEvent.press(screen.getByRole("button", { name: "Continuar" }));
};

describe("SignInScreen", () => {
  beforeEach(() => {
    useAuthFlowStore.getState().reset();
    useSessionStore.getState().setAnonymous(null);
    jest.mocked(biometricService.isAvailable).mockResolvedValue(false);
    jest.mocked(biometricService.savedEmail).mockResolvedValue(null);
  });

  it("si es profesor, guarda el email para el paso 2 y va a la contraseña", async () => {
    jest.mocked(checkEmailService.checkEmail).mockResolvedValue({
      email: "ana@club.com",
      exists: true,
      is_student: true,
      is_teacher: true,
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

  it("si no es profesor, el botón pasa a Registrarse y lleva al registro", async () => {
    jest.mocked(checkEmailService.checkEmail).mockResolvedValue({
      email: "nuevo@club.com",
      exists: false,
      is_student: false,
      is_teacher: false,
    });
    renderWithProviders(<SignInScreen />);

    escribirYContinuar("nuevo@club.com");

    await screen.findByText("Correo no encontrado. Verifica tu correo o regístrate");
    // El registro lo recibe ya escrito.
    expect(useAuthFlowStore.getState().email).toBe("nuevo@club.com");
    // Como en la app de alumnos, el mismo botón pasa a "Registrarse".
    fireEvent.press(screen.getByRole("button", { name: "Registrarse" }));
    expect(mockPush).toHaveBeenCalledWith("/sign-up");
  });

  it("un email que solo es de alumno no va a la contraseña", async () => {
    jest.mocked(checkEmailService.checkEmail).mockResolvedValue({
      email: "alumno@club.com",
      exists: true,
      is_student: true,
      is_teacher: false,
    });
    renderWithProviders(<SignInScreen />);

    escribirYContinuar("alumno@club.com");

    await screen.findByRole("button", { name: "Registrarse" });
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("al volver del registro, el botón vuelve a Continuar para poder entrar", async () => {
    jest.mocked(checkEmailService.checkEmail).mockResolvedValue({
      email: "nuevo@club.com",
      exists: false,
      is_student: false,
      is_teacher: false,
    });
    renderWithProviders(<SignInScreen />);
    escribirYContinuar("nuevo@club.com");
    await screen.findByRole("button", { name: "Registrarse" });

    act(() => mockOnFocus?.());

    expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy();
    expect(screen.queryByText("Correo no encontrado. Verifica tu correo o regístrate")).toBeNull();
    expect(screen.getByLabelText("Correo electrónico")).toHaveProp("value", "nuevo@club.com");
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

  describe("con la biometría activada", () => {
    const saved = { email: "ana@club.com", userId: 42, refreshToken: "refresco-guardado" };
    const tokens = { access_token: "acceso", refresh_token: "refresco-nuevo" };

    beforeEach(() => {
      jest.mocked(biometricService.isAvailable).mockResolvedValue(true);
      jest.mocked(biometricService.savedEmail).mockResolvedValue(saved.email);
      jest.mocked(biometricService.unlock).mockResolvedValue({ status: "ok", credentials: saved });
      jest.mocked(requestTokenRefresh).mockResolvedValue(tokens);
      jest.mocked(completeSignIn).mockResolvedValue({ tokens, termsPending: false });
    });

    it("al abrir trae su email escrito y la lanza sola", async () => {
      renderWithProviders(<SignInScreen />);

      await waitFor(() => expect(completeSignIn).toHaveBeenCalledWith(tokens));
      expect(screen.getByLabelText("Correo electrónico")).toHaveProp("value", "ana@club.com");
      expect(requestTokenRefresh).toHaveBeenCalledWith("refresco-guardado");
    });

    it("justo después de cerrar sesión a mano no se lanza sola", async () => {
      useSessionStore.getState().setAnonymous("manual");
      renderWithProviders(<SignInScreen />);

      await screen.findByRole("button", { name: "Acceder con biometría" });
      expect(biometricService.unlock).not.toHaveBeenCalled();
    });

    it("el botón pasa a «Acceder con biometría» con su email y la usa al pulsarlo", async () => {
      useSessionStore.getState().setAnonymous("manual");
      renderWithProviders(<SignInScreen />);

      const button = await screen.findByRole("button", { name: "Acceder con biometría" });
      await act(async () => {
        fireEvent.press(button);
      });

      expect(biometricService.unlock).toHaveBeenCalled();
      expect(checkEmailService.checkEmail).not.toHaveBeenCalled();
    });

    it("con otro email el botón vuelve a Continuar", async () => {
      useSessionStore.getState().setAnonymous("manual");
      renderWithProviders(<SignInScreen />);
      await screen.findByRole("button", { name: "Acceder con biometría" });

      fireEvent.changeText(screen.getByLabelText("Correo electrónico"), "otro@club.com");

      expect(screen.getByRole("button", { name: "Continuar" })).toBeTruthy();
    });

    it("si le faltan los términos abre su modal", async () => {
      jest.mocked(completeSignIn).mockResolvedValue({ tokens, termsPending: true });
      renderWithProviders(<SignInScreen />);

      expect(await screen.findByText("Términos y Condiciones")).toBeTruthy();
    });
  });
});
