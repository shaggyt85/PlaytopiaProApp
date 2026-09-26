import * as SecureStore from "expo-secure-store";

import { SecureTokenStorage } from "@/shared/services/tokenStorage";

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
  beforeEach(() => jest.clearAllMocks());

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
