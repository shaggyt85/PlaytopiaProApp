import type { SecureKeyValue } from "@/shared/services/biometricCredentialStore";

/** SecureStore en memoria para tests: las tres funciones que usa la app. */
export function createFakeSecureStore(initial: Record<string, string> = {}) {
  const values = new Map(Object.entries(initial));
  const secure = {
    getItemAsync: jest.fn(async (key: string) => values.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => {
      values.set(key, value);
    }),
    deleteItemAsync: jest.fn(async (key: string) => {
      values.delete(key);
    }),
  };
  return { secure: secure as unknown as SecureKeyValue & typeof secure, values };
}
