import * as SecureStore from "expo-secure-store";

/**
 * Lo que la biometría necesita para abrir la sesión sin contraseña: de quién
 * es y un refresh token (credencial revocable, nunca la contraseña).
 */
export interface BiometricCredentials {
  email: string;
  /** Profesor al que pertenecen: la copia solo se actualiza con tokens suyos. */
  userId: number;
  refreshToken: string;
}

export interface IBiometricCredentialStore {
  get(): Promise<BiometricCredentials | null>;
  save(credentials: BiometricCredentials): Promise<void>;
  /**
   * Core rota el refresh token en cada renovación: se guarda el nuevo, pero
   * solo si es del mismo profesor. Sin biometría activada no hace nada.
   */
  updateRefreshToken(userId: number, refreshToken: string): Promise<void>;
  clear(): Promise<void>;
}

/** Lo que se usa de SecureStore (inyectable en los tests). */
export type SecureKeyValue = Pick<typeof SecureStore, "getItemAsync" | "setItemAsync" | "deleteItemAsync">;

const KEY = "biometric_credentials";

/**
 * En SecureStore (Keychain / Keystore), como los tokens de sesión: quien tenga
 * el refresh token puede actuar como el profesor.
 */
export class SecureBiometricCredentialStore implements IBiometricCredentialStore {
  constructor(private readonly secure: SecureKeyValue = SecureStore) {}

  async get(): Promise<BiometricCredentials | null> {
    const raw = await this.secure.getItemAsync(KEY);
    if (!raw) return null;
    try {
      const value = JSON.parse(raw) as Partial<BiometricCredentials>;
      const valid =
        typeof value.email === "string" &&
        typeof value.userId === "number" &&
        typeof value.refreshToken === "string";
      return valid ? (value as BiometricCredentials) : null;
    } catch {
      return null;
    }
  }

  async save(credentials: BiometricCredentials): Promise<void> {
    await this.secure.setItemAsync(KEY, JSON.stringify(credentials));
  }

  async updateRefreshToken(userId: number, refreshToken: string): Promise<void> {
    const current = await this.get();
    if (!current || current.userId !== userId) return;
    await this.save({ ...current, refreshToken });
  }

  /**
   * Borra y comprueba que se borró, con un reintento: una credencial vieja que
   * se queda ofrecería una biometría rota en bucle.
   */
  async clear(): Promise<void> {
    await this.secure.deleteItemAsync(KEY);
    if (await this.secure.getItemAsync(KEY)) await this.secure.deleteItemAsync(KEY);
  }
}

export const biometricCredentialStore: IBiometricCredentialStore = new SecureBiometricCredentialStore();
