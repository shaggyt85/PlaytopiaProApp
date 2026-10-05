import axios from "axios";
import { z } from "zod";

import { ENDPOINTS } from "@/shared/config/endpoints";
import { env } from "@/shared/config/env";

// 15 s: margen para los arranques en frío del backend.
export const HTTP_TIMEOUT_MS = 15_000;

const SessionTokensSchema = z.object({
  access_token: z.string().min(1),
  refresh_token: z.string().min(1),
});

/** Par de tokens de una sesión (login, renovación o biometría). */
export type SessionTokens = z.infer<typeof SessionTokensSchema>;

/**
 * Pide tokens nuevos con un refresh token. Única petición de renovación: la
 * usan la renovación automática del cliente HTTP y la entrada con biometría.
 * Va con axios sin interceptores: un 401 del propio refresh no debe intentar
 * otro refresh. Core rota el refresh token: el que se usa deja de valer.
 */
export async function requestTokenRefresh(refreshToken: string): Promise<SessionTokens> {
  const { data } = await axios.post(
    `${env.EXPO_PUBLIC_API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`,
    { refresh_token: refreshToken },
    { timeout: HTTP_TIMEOUT_MS },
  );
  return SessionTokensSchema.parse(data);
}

/**
 * ¿Core rechazó el refresh token (4xx)? Solo entonces la sesión está muerta.
 * Red, timeout, Keychain o 5xx no dicen nada: no se sabe si todavía vale.
 */
export function isRefreshRejected(error: unknown): boolean {
  const status = (error as { response?: { status?: number } })?.response?.status;
  return typeof status === "number" && status >= 400 && status < 500;
}
