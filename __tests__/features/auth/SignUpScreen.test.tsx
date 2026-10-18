import { fireEvent, screen, waitFor } from "@testing-library/react-native";

import { TERMS_VERSION } from "@/features/auth/config/terms";
import { signUpService } from "@/features/auth/services/signUpService";
import { SignUpScreen } from "@/features/auth/SignUpScreen";
import { useAuthFlowStore } from "@/features/auth/store/authFlowStore";
import { HttpError } from "@/shared/services/HttpError";

import { renderWithProviders } from "../../helpers/renderWithProviders";
import { settle } from "../../helpers/settle";

const mockDismissTo = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ dismissTo: mockDismissTo, back: jest.fn(), canGoBack: () => true }),
}));
jest.mock("@/features/auth/services/signUpService", () => ({
  signUpService: { signUp: jest.fn() },
}));
jest.mock("@react-native-community/datetimepicker", () =>
  jest.requireActual("../../helpers/dateTimePickerMock"),
);

const escribir = (label: string, value: string) => {
  fireEvent.changeText(screen.getByLabelText(label), value);
  fireEvent(screen.getByLabelText(label), "blur");
};

/** Rellena el formulario entero con datos válidos. */
function rellenar() {
  escribir("Nombre", "Ana");
  escribir("Apellidos", "García");
  escribir("Correo electrónico", "ana@club.com");
  escribir("Número de teléfono", "612345678");
  fireEvent.press(screen.getByRole("button", { name: "Fecha de nacimiento" }));
  fireEvent.press(screen.getByLabelText("rueda"));
  fireEvent.press(screen.getByRole("button", { name: "Aceptar" }));
  fireEvent.press(screen.getByRole("radio", { name: "Femenino" }));
  escribir("Contraseña", "Segura1!");
  escribir("Repetir tu contraseña", "Segura1!");
  fireEvent.press(
    screen.getByRole("checkbox", {
      name: "Al registrarte aceptas nuestras condiciones de uso y políticas de privacidad",
    }),
  );
}

const botonContinuar = () => screen.getByRole("button", { name: "Continuar" });

describe("SignUpScreen", () => {
  beforeEach(() => useAuthFlowStore.getState().reset());

  it("trae ya escrito el email del primer paso", () => {
    useAuthFlowStore
      .getState()
      .setCheckedEmail("nuevo@club.com", { isStudent: false, needsPasswordSetup: false });
    renderWithProviders(<SignUpScreen />);

    expect(screen.getByLabelText("Correo electrónico")).toHaveProp("value", "nuevo@club.com");
  });

  it("pinta el formulario del registro sin logo", () => {
    renderWithProviders(<SignUpScreen />);

    expect(screen.getByText("¡Regístrate!")).toBeTruthy();
    expect(screen.queryByText("Playtopia Pro")).toBeNull();
  });

  it("el botón está apagado hasta que el formulario es válido", async () => {
    renderWithProviders(<SignUpScreen />);

    expect(botonContinuar()).toBeDisabled();
    rellenar();

    await waitFor(() => expect(botonContinuar()).toBeEnabled());
  });

  it("el error de un campo sale al dejarlo, no mientras se escribe", async () => {
    renderWithProviders(<SignUpScreen />);
    // Se busca el campo en cada paso: al pintar el error, el anterior queda viejo.
    const nombre = () => screen.getByLabelText("Nombre");

    fireEvent.changeText(nombre(), "A");
    expect(screen.queryByText("El nombre debe tener al menos 2 caracteres")).toBeNull();

    fireEvent(nombre(), "blur");
    await screen.findByText("El nombre debe tener al menos 2 caracteres");

    fireEvent.changeText(nombre(), "Ana");
    await settle();
    expect(screen.queryByText("El nombre debe tener al menos 2 caracteres")).toBeNull();
  });

  it("al registrarse envía el contrato de Core y vuelve al login", async () => {
    jest.mocked(signUpService.signUp).mockResolvedValue({ id: 42, email: "ana@club.com" });
    renderWithProviders(<SignUpScreen />);

    rellenar();
    await waitFor(() => expect(botonContinuar()).toBeEnabled());
    fireEvent.press(botonContinuar());

    await waitFor(() => expect(mockDismissTo).toHaveBeenCalledWith("/sign-in"));
    expect(signUpService.signUp).toHaveBeenCalledWith({
      name: "Ana",
      last_name: "García",
      email: "ana@club.com",
      password: "Segura1!",
      phone_number: "+34612345678",
      birthday: "1990-05-03T00:00:00",
      gender: 2,
      terms_version: TERMS_VERSION,
    });
  });

  it("si Core rechaza el alta, muestra el error traducido y se queda", async () => {
    jest.mocked(signUpService.signUp).mockRejectedValue(
      HttpError.fromResponse(409, {
        type: "about:blank",
        title: "Conflict",
        status: 409,
        detail: "El email ya está registrado",
      }),
    );
    renderWithProviders(<SignUpScreen />);

    rellenar();
    await waitFor(() => expect(botonContinuar()).toBeEnabled());
    fireEvent.press(botonContinuar());

    await screen.findByText("Esta acción choca con datos que ya existen.");
    expect(screen.queryByText("El email ya está registrado")).toBeNull();
    expect(mockDismissTo).not.toHaveBeenCalled();
  });
});
