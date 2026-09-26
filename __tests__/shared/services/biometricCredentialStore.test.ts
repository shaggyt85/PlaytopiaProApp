import { SecureBiometricCredentialStore } from "@/shared/services/biometricCredentialStore";

import { createFakeSecureStore } from "../../helpers/fakeSecureStore";

const credentials = { email: "ana@club.com", userId: 42, refreshToken: "refresco" };

describe("SecureBiometricCredentialStore", () => {
  it("guarda y devuelve las credenciales", async () => {
    const store = new SecureBiometricCredentialStore(createFakeSecureStore().secure);

    await store.save(credentials);

    await expect(store.get()).resolves.toEqual(credentials);
  });

  it.each([
    ["sin nada guardado", {}],
    ["con algo que no es JSON", { biometric_credentials: "{no es json" }],
    ["con datos incompletos", { biometric_credentials: JSON.stringify({ email: "a@b.com" }) }],
  ])("%s devuelve null", async (_case, initial: Record<string, string>) => {
    const store = new SecureBiometricCredentialStore(createFakeSecureStore(initial).secure);

    await expect(store.get()).resolves.toBeNull();
  });

  it("actualiza el refresh token solo si es del mismo profesor", async () => {
    const store = new SecureBiometricCredentialStore(createFakeSecureStore().secure);
    await store.save(credentials);

    await store.updateRefreshToken(99, "de-otro");
    await expect(store.get()).resolves.toEqual(credentials);

    await store.updateRefreshToken(42, "nuevo");
    await expect(store.get()).resolves.toEqual({ ...credentials, refreshToken: "nuevo" });
  });

  it("sin biometría activada, actualizar no guarda nada", async () => {
    const { secure, values } = createFakeSecureStore();

    await new SecureBiometricCredentialStore(secure).updateRefreshToken(42, "nuevo");

    expect(values.size).toBe(0);
  });

  it("al borrar comprueba que se borró y reintenta una vez", async () => {
    const { secure } = createFakeSecureStore({ biometric_credentials: JSON.stringify(credentials) });
    // El primer borrado "no pega".
    secure.deleteItemAsync.mockImplementationOnce(async () => undefined);
    const store = new SecureBiometricCredentialStore(secure);

    await store.clear();

    expect(secure.deleteItemAsync).toHaveBeenCalledTimes(2);
    await expect(store.get()).resolves.toBeNull();
  });
});
