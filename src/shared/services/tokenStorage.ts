import * as SecureStore from "expo-secure-store";

import { decodeSessionClaims } from "@/shared/utils/jwt";

import {
  biometricCredentialStore,
  type IBiometricCredentialStore,
  type SecureKeyValue,
} from "./biometricCredentialStore";

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

  constructor(
    private readonly secure: SecureKeyValue = SecureStore,
    private readonly biometric: IBiometricCredentialStore = biometricCredentialStore,
  ) {}

  async getAccessToken(): Promise<string | null> {
    if (this.accessToken === undefined) {
      this.accessToken = await this.secure.getItemAsync(ACCESS_TOKEN_KEY);
    }
    return this.accessToken;
  }

  getRefreshToken(): Promise<string | null> {
    return this.secure.getItemAsync(REFRESH_TOKEN_KEY);
  }

  async setTokens(accessToken: string, refreshToken: string): Promise<void> {
    await this.secure.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
    await this.secure.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    this.accessToken = accessToken;
    await this.syncBiometric(accessToken, refreshToken);
  }

  /**
   * Único sitio que mantiene al día la copia de la biometría: cada vez que se
   * guardan tokens (login o renovación), si son del profesor que la activó.
   * Un fallo aquí nunca impide abrir o renovar la sesión.
   */
  private async syncBiometric(accessToken: string, refreshToken: string): Promise<void> {
    const claims = decodeSessionClaims(accessToken);
    if (!claims) return;
    try {
      await this.biometric.updateRefreshToken(claims.userId, refreshToken);
    } catch {
      // La biometría quedará desfasada; al fallar, pedirá entrar con contraseña.
    }
  }

  async clearTokens(): Promise<void> {
    this.accessToken = null;
    await this.secure.deleteItemAsync(ACCESS_TOKEN_KEY);
    await this.secure.deleteItemAsync(REFRESH_TOKEN_KEY);
  }
}

export const tokenStorage: ITokenStorage = new SecureTokenStorage();
