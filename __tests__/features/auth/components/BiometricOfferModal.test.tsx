import { act, fireEvent, screen } from "@testing-library/react-native";
import { Alert } from "react-native";

import { BiometricOfferModal } from "@/features/auth/components/BiometricOfferModal";
import { biometricService } from "@/features/auth/services/biometricService";
import { useBiometricOfferStore } from "@/features/auth/store/biometricOfferStore";

import { renderWithProviders } from "../../../helpers/renderWithProviders";

jest.mock("@/features/auth/services/biometricService", () => ({
  biometricService: {
    isAvailable: jest.fn(),
    savedEmail: jest.fn(),
    enable: jest.fn(),
    unlock: jest.fn(),
    disable: jest.fn(),
  },
}));
jest.mock("@/shared/services/tokenStorage", () => ({
  tokenStorage: { getRefreshToken: jest.fn().mockResolvedValue("refresco-vigente") },
}));

const activate = () =>
  act(async () => {
    fireEvent.press(screen.getByRole("button", { name: "Activar biometría" }));
  });

describe("BiometricOfferModal", () => {
  beforeEach(() => {
    jest.spyOn(Alert, "alert").mockImplementation(() => undefined);
    jest.mocked(biometricService.isAvailable).mockResolvedValue(true);
    jest.mocked(biometricService.savedEmail).mockResolvedValue(null);
    useBiometricOfferStore.getState().setOffer("ana@club.com", 42);
  });

  afterEach(() => jest.restoreAllMocks());

  it("tras entrar con contraseña ofrece activar la biometría, con sus ventajas", async () => {
    renderWithProviders(<BiometricOfferModal />);

    expect(await screen.findByText("Activa el acceso con biometría")).toBeTruthy();
    expect(screen.getByText("Entra más rápido y seguro con la biometría de tu móvil")).toBeTruthy();
    expect(screen.getByText("Acceso instantáneo")).toBeTruthy();
    expect(screen.getByText("Máxima seguridad")).toBeTruthy();
    expect(screen.getByText("Datos cifrados")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Ahora no" })).toBeTruthy();
  });

  it("al activarla avisa con un Alert y se cierra", async () => {
    jest.mocked(biometricService.enable).mockResolvedValue("enabled");
    renderWithProviders(<BiometricOfferModal />);
    await screen.findByText("Activa el acceso con biometría");

    await activate();

    expect(Alert.alert).toHaveBeenCalledWith(
      "Biometría activada",
      "La próxima vez podrás entrar con tu biometría.",
      [{ text: "Aceptar" }],
    );
    expect(screen.queryByText("Activa el acceso con biometría")).toBeNull();
  });

  it("si falla avisa con un Alert y sigue abierto para reintentar", async () => {
    jest.mocked(biometricService.enable).mockResolvedValue("failed");
    renderWithProviders(<BiometricOfferModal />);
    await screen.findByText("Activa el acceso con biometría");

    await activate();

    expect(Alert.alert).toHaveBeenCalledWith(
      "No se ha podido activar",
      "No se ha podido verificar tu identidad. Inténtalo de nuevo.",
      [{ text: "Aceptar" }],
    );
    expect(screen.getByText("Activa el acceso con biometría")).toBeTruthy();
  });

  it("si el móvil ya no puede usarla lo explica", async () => {
    jest.mocked(biometricService.enable).mockResolvedValue("unavailable");
    renderWithProviders(<BiometricOfferModal />);
    await screen.findByText("Activa el acceso con biometría");

    await activate();

    expect(Alert.alert).toHaveBeenCalledWith(
      "Biometría no disponible",
      "Configura la biometría o un código de bloqueo en tu móvil e inténtalo de nuevo.",
      [{ text: "Aceptar" }],
    );
  });

  it("si cancela el diálogo del sistema no avisa de nada", async () => {
    jest.mocked(biometricService.enable).mockResolvedValue("cancelled");
    renderWithProviders(<BiometricOfferModal />);
    await screen.findByText("Activa el acceso con biometría");

    await activate();

    expect(Alert.alert).not.toHaveBeenCalled();
    expect(screen.getByText("Activa el acceso con biometría")).toBeTruthy();
  });

  it("«Ahora no» lo cierra sin activarla", async () => {
    renderWithProviders(<BiometricOfferModal />);
    await screen.findByText("Activa el acceso con biometría");

    fireEvent.press(screen.getByRole("button", { name: "Ahora no" }));

    expect(screen.queryByText("Activa el acceso con biometría")).toBeNull();
    expect(biometricService.enable).not.toHaveBeenCalled();
    expect(useBiometricOfferStore.getState().offer).toBeNull();
  });

  it("la X también cuenta como «Ahora no»", async () => {
    renderWithProviders(<BiometricOfferModal />);
    await screen.findByText("Activa el acceso con biometría");

    fireEvent.press(screen.getByRole("button", { name: "Cerrar" }));

    expect(useBiometricOfferStore.getState().offer).toBeNull();
  });
});
