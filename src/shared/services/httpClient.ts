import { env } from "@/shared/config/env";
import { getLocale } from "@/shared/config/i18n";
import { reportError } from "@/shared/config/sentry";
import { recordServerDate } from "@/shared/utils/serverClock";

import { BaseHttpClient, type IHttpClient } from "./BaseHttpClient";
import { createSessionRefresher } from "./sessionRefresher";
import { HTTP_TIMEOUT_MS, requestTokenRefresh } from "./tokenRefresh";
import { tokenStorage } from "./tokenStorage";

// Punto de composición: aquí se eligen las piezas concretas (DIP). El resto
// de la app solo ve `httpClient` como IHttpClient.

const refreshSession = createSessionRefresher({
  tokens: tokenStorage,
  requestRefresh: requestTokenRefresh,
});

const client = new BaseHttpClient({
  axiosConfig: {
    baseURL: env.EXPO_PUBLIC_API_BASE_URL,
    timeout: HTTP_TIMEOUT_MS,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  },
  tokens: tokenStorage,
  refreshSession,
  // Cada respuesta trae la hora del servidor en la cabecera Date.
  observeResponseHeaders: (headers) => recordServerDate(headers.date),
  // El idioma activo: el del teléfono o, si lo cambió, el que eligió.
  requestLanguage: getLocale,
  // Core y la app no cuadran (p. ej. tras un despliegue): que se vea en Sentry.
  onContractError: reportError,
});

export const httpClient: IHttpClient = client;

/** Para que la capa de sesión reaccione cuando Core da la sesión por muerta. */
export const onSessionExpired = (handler: () => void) =>
  client.onSessionExpired(handler);
