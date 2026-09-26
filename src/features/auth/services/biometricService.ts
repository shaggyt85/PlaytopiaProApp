import * as LocalAuthentication from "expo-local-authentication";

import {
  biometricCredentialStore,
  type BiometricCredentials,
  type IBiometricCredentialStore,
} from "@/shared/services/biometricCredentialStore";

/**
 * El sensor del móvil: biometría o, si falla, el código del móvil (se puede
 * entrar con clave, huella o Face ID). Envuelve expo-local-authentication para
 * poder sustituirlo en los tests.
 */
export interface IBiometricSensor {
  /** Hay biometría o código configurado y el móvil puede usarlo. */
  isReady(): Promise<boolean>;
  /** Pide la verificación; `true` si el usuario la supera. */
  verify(promptMessage: string, cancelLabel: string): Promise<"ok" | "cancelled" | "failed">;
}

const CANCELLED = new Set(["user_cancel", "system_cancel", "app_cancel"]);

export const expoBiometricSensor: IBiometricSensor = {
  async isReady() {
    try {
      const [hasHardware, isEnrolled] = await Promise.all([
        LocalAuthentication.hasHardwareAsync(),
        LocalAuthentication.isEnrolledAsync(),
      ]);
      return hasHardware && isEnrolled;
    } catch {
      return false;
    }
  },
  async verify(promptMessage, cancelLabel) {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel,
      // Si la biometría falla, el código del móvil también vale.
      disableDeviceFallback: false,
    });
    if (result.success) return "ok";
    return CANCELLED.has(result.error) ? "cancelled" : "failed";
  },
};

/** Textos del diálogo del sistema, ya traducidos por quien llama. */
export interface BiometricPrompt {
  message: string;
  cancel: string;
}

export type EnableResult = "enabled" | "unavailable" | "cancelled" | "failed";
export type UnlockResult =
  | { status: "ok"; credentials: BiometricCredentials }
  | { status: "not-enabled" | "cancelled" | "failed" };

export interface IBiometricService {
  /** El móvil puede usar biometría. */
  isAvailable(): Promise<boolean>;
  /** Email con la biometría activada (sin pedir nada), o null. */
  savedEmail(): Promise<string | null>;
  /** Verifica al profesor y guarda lo necesario para entrar sin contraseña. */
  enable(credentials: BiometricCredentials, prompt: BiometricPrompt): Promise<EnableResult>;
  /** Verifica al profesor y devuelve lo guardado para abrir la sesión. */
  unlock(prompt: BiometricPrompt): Promise<UnlockResult>;
  /** Desactiva la biometría. */
  disable(): Promise<void>;
}

/** Solo sensor y almacén: cuándo usarla lo deciden los hooks. */
export class BiometricService implements IBiometricService {
  constructor(
    private readonly sensor: IBiometricSensor,
    private readonly store: IBiometricCredentialStore,
  ) {}

  isAvailable(): Promise<boolean> {
    return this.sensor.isReady();
  }

  async savedEmail(): Promise<string | null> {
    return (await this.store.get())?.email ?? null;
  }

  async enable(credentials: BiometricCredentials, prompt: BiometricPrompt): Promise<EnableResult> {
    if (!(await this.sensor.isReady())) return "unavailable";
    const verification = await this.sensor.verify(prompt.message, prompt.cancel);
    if (verification !== "ok") return verification;
    await this.store.save(credentials);
    return "enabled";
  }

  async unlock(prompt: BiometricPrompt): Promise<UnlockResult> {
    const credentials = await this.store.get();
    if (!credentials) return { status: "not-enabled" };
    const verification = await this.sensor.verify(prompt.message, prompt.cancel);
    return verification === "ok" ? { status: "ok", credentials } : { status: verification };
  }

  disable(): Promise<void> {
    return this.store.clear();
  }
}

export const biometricService: IBiometricService = new BiometricService(
  expoBiometricSensor,
  biometricCredentialStore,
);
