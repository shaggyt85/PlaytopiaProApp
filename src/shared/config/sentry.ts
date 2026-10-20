import * as Sentry from "@sentry/react-native";
import { AppState } from "react-native";

import { env, type Env } from "@/shared/config/env";

// Informes de errores. Copiado de la appStudent (app/_layout.tsx), con dos
// diferencias: se enciende por tener DSN y no por un interruptor aparte, y no
// manda PII por defecto (IP, cabeceras): para diagnosticar basta con el error.

type SentryEnv = Env["EXPO_PUBLIC_SENTRY_ENV"];

/**
 * Entorno de los eventos. Manda el que declara el perfil de eas.json: un build
 * `preview` se compila en Release, así que por `__DEV__` caería en producción,
 * mezclado con los fallos de los clubes.
 */
export function resolveSentryEnvironment(declared: SentryEnv, isDev: boolean): string {
  if (declared) return declared;
  return isDev ? "development" : "production";
}

/**
 * Arranca Sentry si hay DSN; sin él (local, tests) no hace nada.
 * Devuelve si quedó encendido.
 */
export function initSentry(
  config: Pick<Env, "EXPO_PUBLIC_SENTRY_DSN" | "EXPO_PUBLIC_SENTRY_ENV"> = env,
  isDev: boolean = __DEV__,
): boolean {
  if (!config.EXPO_PUBLIC_SENTRY_DSN) return false;

  Sentry.init({
    dsn: config.EXPO_PUBLIC_SENTRY_DSN,
    environment: resolveSentryEnvironment(config.EXPO_PUBLIC_SENTRY_ENV, isDev),
    sendDefaultPii: false,
    enableLogs: false,
    // Una sesión que termina sin cierre limpio sale como salida anormal en
    // Releases: es la única señal de que el sistema mató la app en background,
    // porque ahí no hay excepción que capturar.
    enableAutoSessionTracking: true,
    // Qué había en pantalla y el stack también en los mensajes sueltos.
    attachViewHierarchy: true,
    attachStacktrace: true,
  });

  // Migas del ciclo de vida: cuánto estuvo fuera la app antes de un fallo.
  AppState.addEventListener("change", (state) => {
    Sentry.addBreadcrumb({
      category: "app.lifecycle",
      message: `AppState → ${state}`,
      level: "info",
    });
  });

  return true;
}

/** Manda a Sentry un error que la app ya gestiona (no rompe nada, pero hay que verlo). Sin DSN, no hace nada. */
export const reportError = (error: unknown): void => {
  Sentry.captureException(error);
};

/** Envuelve el componente raíz para capturar los errores de render. */
export const wrapWithSentry = Sentry.wrap;
