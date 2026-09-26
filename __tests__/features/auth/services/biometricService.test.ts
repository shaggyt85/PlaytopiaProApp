import { BiometricService, type IBiometricSensor } from "@/features/auth/services/biometricService";
import type {
  BiometricCredentials,
  IBiometricCredentialStore,
} from "@/shared/services/biometricCredentialStore";

const credentials: BiometricCredentials = { email: "ana@club.com", userId: 42, refreshToken: "refresco" };
const prompt = { message: "Verifica tu identidad", cancel: "Cancelar" };

function build(
  options: { ready?: boolean; verify?: "ok" | "cancelled" | "failed"; saved?: BiometricCredentials | null } = {},
) {
  const sensor: jest.Mocked<IBiometricSensor> = {
    isReady: jest.fn().mockResolvedValue(options.ready ?? true),
    verify: jest.fn().mockResolvedValue(options.verify ?? "ok"),
  };
  const store: jest.Mocked<IBiometricCredentialStore> = {
    get: jest.fn().mockResolvedValue(options.saved ?? null),
    save: jest.fn().mockResolvedValue(undefined),
    updateRefreshToken: jest.fn(),
    clear: jest.fn().mockResolvedValue(undefined),
  };
  return { service: new BiometricService(sensor, store), sensor, store };
}

describe("BiometricService", () => {
  it("está disponible si el sensor está listo", async () => {
    await expect(build({ ready: true }).service.isAvailable()).resolves.toBe(true);
    await expect(build({ ready: false }).service.isAvailable()).resolves.toBe(false);
  });

  it("da el email guardado sin pedir verificación", async () => {
    const { service, sensor } = build({ saved: credentials });

    await expect(service.savedEmail()).resolves.toBe("ana@club.com");
    expect(sensor.verify).not.toHaveBeenCalled();
  });

  describe("activar", () => {
    it("verifica con los textos dados y guarda las credenciales", async () => {
      const { service, sensor, store } = build();

      await expect(service.enable(credentials, prompt)).resolves.toBe("enabled");

      expect(sensor.verify).toHaveBeenCalledWith("Verifica tu identidad", "Cancelar");
      expect(store.save).toHaveBeenCalledWith(credentials);
    });

    it("sin biometría en el móvil no pide nada ni guarda", async () => {
      const { service, sensor, store } = build({ ready: false });

      await expect(service.enable(credentials, prompt)).resolves.toBe("unavailable");

      expect(sensor.verify).not.toHaveBeenCalled();
      expect(store.save).not.toHaveBeenCalled();
    });

    it.each(["cancelled", "failed"] as const)("si la verificación termina en %s no guarda", async (result) => {
      const { service, store } = build({ verify: result });

      await expect(service.enable(credentials, prompt)).resolves.toBe(result);

      expect(store.save).not.toHaveBeenCalled();
    });
  });

  describe("entrar", () => {
    it("tras verificar devuelve lo guardado", async () => {
      const { service } = build({ saved: credentials });

      await expect(service.unlock(prompt)).resolves.toEqual({ status: "ok", credentials });
    });

    it("sin biometría activada no pide verificación", async () => {
      const { service, sensor } = build({ saved: null });

      await expect(service.unlock(prompt)).resolves.toEqual({ status: "not-enabled" });
      expect(sensor.verify).not.toHaveBeenCalled();
    });

    it("si cancela no devuelve las credenciales", async () => {
      const { service } = build({ saved: credentials, verify: "cancelled" });

      await expect(service.unlock(prompt)).resolves.toEqual({ status: "cancelled" });
    });
  });

  it("desactivar borra lo guardado", async () => {
    const { service, store } = build({ saved: credentials });

    await service.disable();

    expect(store.clear).toHaveBeenCalled();
  });
});
