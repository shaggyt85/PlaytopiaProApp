import { act, fireEvent, screen, waitFor } from "@testing-library/react-native";

import { PasswordScreen } from "@/features/auth/PasswordScreen";
import { TERMS_VERSION } from "@/features/auth/schemas/signUp.schema";
import { signInService } from "@/features/auth/services/signInService";
import { useAuthFlowStore } from "@/features/auth/store/authFlowStore";
import { HttpError } from "@/shared/services/HttpError";
import { session } from "@/shared/services/session";
import { teacherKeys, teacherProfileService } from "@/shared/services/teacherProfileService";

import { signInTokens, teacherProfile } from "../../helpers/authFactories";
import { renderWithProviders } from "../../helpers/renderWithProviders";
import { settle } from "../../helpers/settle";

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
jest.mock("@/shared/services/teacherProfileService", () => ({
  ...jest.requireActual("@/shared/services/teacherProfileService"),
  teacherProfileService: { get: jest.fn(), update: jest.fn() },
}));
jest.mock("@/shared/services/session", () => ({
  session: {
    start: jest.fn().mockResolvedValue(true),
    saveTokens: jest.fn().mockResolvedValue(undefined),
    end: jest.fn().mockResolvedValue(undefined),
  },
}));


const tokens = signInTokens;
const terms = teacherProfile;

const entrar = (password: string) => {
  fireEvent.changeText(screen.getByLabelText("Contraseña"), password);
  fireEvent.press(screen.getByRole("button", { name: "Continuar" }));
};

describe("PasswordScreen", () => {
  beforeEach(() => {
    useAuthFlowStore
      .getState()
      .setCheckedEmail("ana@club.com", { isStudent: false, needsPasswordSetup: false });
    jest.mocked(teacherProfileService.get).mockResolvedValue(terms(TERMS_VERSION));
  });

  it("entra con el email del paso 1 como username y abre la sesión", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    renderWithProviders(<PasswordScreen />);

    expect(screen.queryByText("¡Hola de nuevo!")).toBeNull();
    expect(screen.getByText("ana@club.com")).toBeTruthy();
    entrar("secreta");

    await waitFor(() => expect(session.start).toHaveBeenCalledWith(tokens.access_token, "refresco"));
    expect(signInService.signIn).toHaveBeenCalledWith({
      username: "ana@club.com",
      password: "secreta",
    });
  });

  it("sin los términos vigentes no entra: abre su modal y al aceptarlos entra", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    jest.mocked(teacherProfileService.get).mockResolvedValue(terms(null));
    jest.mocked(teacherProfileService.update).mockResolvedValue(terms(TERMS_VERSION));
    const { client } = renderWithProviders(<PasswordScreen />);

    entrar("secreta");

    await screen.findByText("Términos y Condiciones");
    expect(session.saveTokens).toHaveBeenCalledWith(tokens.access_token, "refresco");
    expect(session.start).not.toHaveBeenCalled();

    await act(async () => {
      fireEvent.press(screen.getByRole("button", { name: "Aceptar" }));
    });

    expect(teacherProfileService.update).toHaveBeenCalledWith(42, { terms_version: TERMS_VERSION });
    expect(session.start).toHaveBeenCalledWith(tokens.access_token, "refresco");
    // El perfil que devuelve Core queda en la caché: el inicio no lo vuelve a pedir.
    expect(client.getQueryData(teacherKeys.profile(42, "es"))).toEqual(terms(TERMS_VERSION));
  });

  it("si cierra el modal sin aceptar, no entra y se borran los tokens", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    jest.mocked(teacherProfileService.get).mockResolvedValue(terms("2020-01-01"));
    renderWithProviders(<PasswordScreen />);

    entrar("secreta");
    await screen.findByText("Términos y Condiciones");

    fireEvent.press(screen.getAllByRole("button", { name: "Cerrar" })[0]);

    expect(session.end).toHaveBeenCalled();
    expect(session.start).not.toHaveBeenCalled();
    await settle();
    expect(screen.queryByText("Términos y Condiciones")).toBeNull();
  });

  it("si Core no guarda la aceptación, lo dice en el modal y no entra", async () => {
    jest.mocked(signInService.signIn).mockResolvedValue(tokens);
    jest.mocked(teacherProfileService.get).mockResolvedValue(terms(null));
    jest.mocked(teacherProfileService.update).mockRejectedValue(HttpError.network());
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
    useAuthFlowStore
      .getState()
      .setCheckedEmail("ana@club.com", { isStudent: true, needsPasswordSetup: false });
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
