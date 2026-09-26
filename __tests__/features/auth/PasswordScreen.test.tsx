import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PasswordScreen } from "@/features/auth/PasswordScreen";
import { signInService } from "@/features/auth/services/signInService";
import { useAuthFlowStore } from "@/features/auth/store/authFlowStore";
import { HttpError } from "@/shared/services/HttpError";
import { session } from "@/shared/services/session";

import { renderWithProviders } from "../../helpers/renderWithProviders";

const mockPush = jest.fn();
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: mockPush, back: mockBack }),
  Redirect: ({ href }: { href: string }) => {
    const { Text } = jest.requireActual("react-native");
    return <Text>{`redirige a ${href}`}</Text>;
  },
}));
jest.mock("@/features/auth/services/signInService", () => ({
  signInService: { signIn: jest.fn() },
}));
jest.mock("@/shared/services/session", () => ({
  session: { start: jest.fn().mockResolvedValue(true) },
}));

const tokens = {
  access_token: "acceso",
  refresh_token: "refresco",
  id: 42,
  role_id: 4,
  db_id: 7,
};

const entrar = (password: string) => {
  fireEvent.changeText(screen.getByLabelText("Contraseña"), password);
  fireEvent.press(screen.getByRole("button", { name: "Continuar" }));
};

describe("PasswordScreen", () => {
  beforeEach(() => {
    useAuthFlowStore.getState().setCheckedEmail("ana@club.com", false);
  });

  it("entra con el email del paso 1 como username y abre la sesión", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    renderWithProviders(<PasswordScreen />);

    expect(screen.queryByText("¡Hola de nuevo!")).toBeNull();
    expect(screen.getByText("ana@club.com")).toBeTruthy();
    entrar("secreta");

    await waitFor(() => expect(session.start).toHaveBeenCalledWith("acceso", "refresco"));
    expect(signInService.signIn).toHaveBeenCalledWith({
      username: "ana@club.com",
      password: "secreta",
    });
  });

  it("un 401 son credenciales incorrectas", async () => {
    jest.mocked(signInService.signIn).mockRejectedValue(HttpError.fromResponse(401, {}));
    renderWithProviders(<PasswordScreen />);

    entrar("mala");

    await screen.findByText("Email o contraseña incorrectos.");
    expect(session.start).not.toHaveBeenCalled();
  });

  it("si el email también es de alumno, aclara que es la contraseña de profesor", async () => {
    useAuthFlowStore.getState().setCheckedEmail("ana@club.com", true);
    jest.mocked(signInService.signIn).mockRejectedValue(HttpError.fromResponse(401, {}));
    renderWithProviders(<PasswordScreen />);

    entrar("la-de-alumno");

    await screen.findByText(
      "Email o contraseña incorrectos. Si también eres alumno, usa la contraseña de tu cuenta de profesor.",
    );
  });

  it("siempre ofrece registrarse y recuperar la contraseña", () => {
    renderWithProviders(<PasswordScreen />);

    fireEvent.press(screen.getByRole("button", { name: "Regístrate" }));
    fireEvent.press(screen.getByRole("button", { name: "¿Has olvidado tu contraseña?" }));

    expect(mockPush).toHaveBeenCalledWith("/sign-up");
    expect(mockPush).toHaveBeenCalledWith("/password-recovery");
  });

  it("pide la contraseña antes de llamar a Core", async () => {
    renderWithProviders(<PasswordScreen />);

    entrar("");

    await screen.findByText("Escribe tu contraseña.");
    expect(signInService.signIn).not.toHaveBeenCalled();
  });

  it("sin email del paso 1 vuelve al principio", () => {
    useAuthFlowStore.getState().reset();
    renderWithProviders(<PasswordScreen />);

    expect(screen.getByText("redirige a /sign-in")).toBeTruthy();
  });
});
