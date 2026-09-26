import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PasswordScreen } from "@/features/auth/PasswordScreen";
import { TERMS_VERSION } from "@/features/auth/schemas/signUp.schema";
import { signInService } from "@/features/auth/services/signInService";
import { termsService } from "@/features/auth/services/termsService";
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
jest.mock("@/features/auth/services/termsService", () => ({
  termsService: { getTerms: jest.fn(), acceptTerms: jest.fn() },
}));
jest.mock("@/shared/services/session", () => ({
  session: {
    start: jest.fn().mockResolvedValue(true),
    saveTokens: jest.fn().mockResolvedValue(undefined),
    end: jest.fn().mockResolvedValue(undefined),
  },
}));

const terms = (version: string | null) => ({
  id: 42,
  terms_version: version,
  accepted_terms_at: version ? "2026-09-26T10:00:00" : null,
});

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
    jest.mocked(termsService.getTerms).mockResolvedValue(terms(TERMS_VERSION));
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

  it("sin los términos vigentes no entra: abre su modal y al aceptarlos entra", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    jest.mocked(termsService.getTerms).mockResolvedValue(terms(null));
    jest.mocked(termsService.acceptTerms).mockResolvedValue(terms(TERMS_VERSION));
    renderWithProviders(<PasswordScreen />);

    entrar("secreta");

    await screen.findByText("Términos y Condiciones");
    expect(session.saveTokens).toHaveBeenCalledWith("acceso", "refresco");
    expect(session.start).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Aceptar" }));
    });

    expect(termsService.acceptTerms).toHaveBeenCalledWith(42, TERMS_VERSION);
    expect(session.start).toHaveBeenCalledWith("acceso", "refresco");
  });

  it("si cierra el modal sin aceptar, no entra y se borran los tokens", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    jest.mocked(termsService.getTerms).mockResolvedValue(terms("2020-01-01"));
    renderWithProviders(<PasswordScreen />);

    entrar("secreta");
    await screen.findByText("Términos y Condiciones");

    fireEvent.press(screen.getAllByRole("button", { name: "Cerrar" })[0]);

    expect(session.end).toHaveBeenCalled();
    expect(session.start).not.toHaveBeenCalled();
    await waitFor(() => expect(screen.queryByText("Términos y Condiciones")).toBeNull());
  });

  it("si Core no guarda la aceptación, lo dice en el modal y no entra", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    jest.mocked(termsService.getTerms).mockResolvedValue(terms(null));
    jest.mocked(termsService.acceptTerms).mockRejectedValue(HttpError.network());
    renderWithProviders(<PasswordScreen />);

    entrar("secreta");
    await screen.findByText("Términos y Condiciones");
    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Aceptar" }));
    });

    expect(screen.getByText("Sin conexión. Revisa tu red e inténtalo de nuevo.")).toBeTruthy();
    expect(session.start).not.toHaveBeenCalled();
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

  it("ofrece recuperar la contraseña, y nada de registrarse (como la app de alumnos)", () => {
    renderWithProviders(<PasswordScreen />);

    fireEvent.press(screen.getByRole("button", { name: "¿Has olvidado tu contraseña?" }));

    expect(mockPush).toHaveBeenCalledWith("/password-recovery");
    expect(screen.queryByText("¿Aún no tienes cuenta de profesor?")).toBeNull();
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
