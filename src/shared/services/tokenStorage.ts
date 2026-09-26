import * as SecureStore from "expo-secure-store";

/**
 * Tokens de sesión. Son credenciales bearer (quien los tenga actúa como el
 * profesor), así que van en SecureStore: Keychain en iOS, Keystore en
 * Android. Nunca en AsyncStorage ni en Zustand (guía §8).
 */
export interface ITokenStorage {
  getAccessToken(): Promise<string | null>;
  getRefreshToken(): Promise<string | null>;
  setTokens(accessToken: string, refreshToken: string): Promise<void>;
  clearTokens(): Promise<void>;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export class SecureTokenStorage implements ITokenStorage {
  // El access token se lee en cada petición: se guarda también en memoria para
  // no ir al Keychain cada vez. `undefined` = todavía no se ha leído.
  private accessToken: string | null | undefined;

  async getAccessToken(): Promise<string | null> {
    if (this.accessToken === undefined) {
      this.accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    }
    return this.accessToken;
  }

  getRefreshToken(): Promise<string | null> {
    return SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    this.accessToken = accessToken;
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export const tokenStorage: ITokenStorage = new SecureTokenStorage();
