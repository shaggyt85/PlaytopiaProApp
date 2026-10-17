import type { TranslationKey } from "@/shared/locales";

/**
 * Qué hace el botón del paso del email, igual que la app de alumnos:
 * - `biometric`: el email es el de la biometría → «Acceder con biometría».
 * - `register`: el email no es de profesor → «Registrarse».
 * - `continue`: lo demás → «Continuar» (comprueba el email).
 */
export type SignInMode = "biometric" | "register" | "continue";

/** El texto del botón de cada modo. */
export const SIGN_IN_BUTTON_TITLE: Record<SignInMode, TranslationKey> = {
  biometric: "auth.biometric.signIn",
  register: "auth.signIn.register",
  continue: "auth.signIn.continue",
};

/** El modo, con su prioridad: la biometría manda sobre el «no encontrado». */
export const signInMode = ({ useBiometric, notFound }: { useBiometric: boolean; notFound: boolean }): SignInMode =>
  useBiometric ? "biometric" : notFound ? "register" : "continue";

/**
 * El error que se enseña, el primero que haya: el de la biometría, el «no
 * encontrado» y el de la comprobación del email, en ese orden.
 */
export const firstError = (...messages: (string | null | undefined | false)[]): string | null =>
  messages.find((message): message is string => Boolean(message)) ?? null;
