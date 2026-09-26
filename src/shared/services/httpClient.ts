import axios from "axios";
import { z } from "zod";

import { env } from "@/shared/config/env";
import { recordServerDate } from "@/shared/utils/serverClock";

import { BaseHttpClient, type IHttpClient } from "./BaseHttpClient";
import { createSessionRefresher } from "./sessionRefresher";
import { tokenStorage } from "./tokenStorage";

// Punto de composición: aquí se eligen las piezas concretas (DIP). El resto
// de la app solo ve `httpClient` como IHttpClient.

/** Ruta del refresh en Core (Scalar: POST /api/auth/refresh). */
const AUTH_REFRESH_PATH = "/auth/refresh";

// 15 s: margen para los arranques en frío del backend.
const TIMEOUT_MS = 15_000;

const RefreshResponseSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

const refreshSession = createSessionRefresher({
  tokens: tokenStorage,
  // Axios sin interceptores: un 401 del propio refresh no debe intentar
  // otro refresh.
  requestRefresh: async (refreshToken) => {
    const { data } = await axios.post(
      `${env.EXPO_PUBLIC_API_BASE_URL}${AUTH_REFRESH_PATH}`,
      { refresh_token: refreshToken },
      { timeout: TIMEOUT_MS },
    );
    return RefreshResponseSchema.parse(data);
  },
});

const client = new BaseHttpClient({
  axiosConfig: {
    baseURL: env.EXPO_PUBLIC_API_BASE_URL,
    timeout: TIMEOUT_MS,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  },
  tokens: tokenStorage,
  refreshSession,
  // Cada respuesta trae la hora del servidor en la cabecera Date.
  observeResponseHeaders: (headers) => recordServerDate(headers.date),
});

export const httpClient: IHttpClient = client;

/** Para que la capa de sesión reaccione cuando Core da la sesión por muerta. */
export const onSessionExpired = (handler: () => void) =>
  client.onSessionExpired(handler);
