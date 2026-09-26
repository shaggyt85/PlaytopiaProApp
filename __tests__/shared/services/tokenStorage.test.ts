import * as SecureStore from "expo-secure-store";

import type { IBiometricCredentialStore } from "@/shared/services/biometricCredentialStore";
import { SecureTokenStorage } from "@/shared/services/tokenStorage";

import { createFakeSecureStore } from "../../helpers/fakeSecureStore";
import { createTestJwt, teacherClaims } from "../../helpers/jwt";

jest.mock("expo-secure-store", () => {
  const store = new Map<string, string>();
  return {
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      store.delete(key);
    }),
  };
});

describe("SecureTokenStorage", () => {
  it("guarda los dos tokens en SecureStore y los devuelve", async () => {
    const storage = new SecureTokenStorage();
    await storage.setTokens("acceso", "refresco");

    expect(SecureStore.setItemAsync).toHaveBeenCalledTimes(2);
    await expect(storage.getAccessToken()).resolves.toBe("acceso");
    await expect(storage.getRefreshToken()).resolves.toBe("refresco");
  });

  it("no vuelve al Keychain en cada lectura del access token", async () => {
    const storage = new SecureTokenStorage();
    await storage.getAccessToken();
    await storage.getAccessToken();

    expect(SecureStore.getItemAsync).toHaveBeenCalledTimes(1);
  });

  it("clearTokens borra los dos y deja de devolver el access token", async () => {
    const storage = new SecureTokenStorage();
    await storage.setTokens("acceso", "refresco");
    await storage.clearTokens();

    expect(SecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
    await expect(storage.getAccessToken()).resolves.toBeNull();
    await expect(storage.getRefreshToken()).resolves.toBeNull();
  });
});

describe("SecureTokenStorage y la biometría", () => {
  const biometricStore = (): jest.Mocked<IBiometricCredentialStore> => ({
    get: jest.fn(),
    save: jest.fn(),
    updateRefreshToken: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn(),
  });

  it("al guardar tokens nuevos actualiza la copia de la biometría con el id del profesor", async () => {
    const biometric = biometricStore();
    const storage = new SecureTokenStorage(createFakeSecureStore().secure, biometric);

    await storage.setTokens(createTestJwt(teacherClaims()), "refresco-nuevo");

    expect(biometric.updateRefreshToken).toHaveBeenCalledWith(42, "refresco-nuevo");
  });

  it("con un access token ilegible no toca la biometría", async () => {
    const biometric = biometricStore();
    const storage = new SecureTokenStorage(createFakeSecureStore().secure, biometric);

    await storage.setTokens("no-es-un-jwt", "refresco");

    expect(biometric.updateRefreshToken).not.toHaveBeenCalled();
  });

  it("si la biometría falla, la sesión se guarda igual", async () => {
    const biometric = biometricStore();
    biometric.updateRefreshToken.mockRejectedValue(new Error("keychain"));
    const storage = new SecureTokenStorage(createFakeSecureStore().secure, biometric);

    await expect(storage.setTokens(createTestJwt(teacherClaims()), "refresco")).resolves.toBeUndefined();
    await expect(storage.getRefreshToken()).resolves.toBe("refresco");
  });
});
