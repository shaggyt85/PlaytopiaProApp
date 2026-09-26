import Base64 from "crypto-js/enc-base64";
import HmacSHA256 from "crypto-js/hmac-sha256";

import { env } from "@/shared/config/env";
import { serverNowSeconds } from "@/shared/utils/serverClock";

const TOKEN_VERSION = "v1";

/** Base64 estándar a base64url sin relleno, que es lo que decodifica Core. */
const toBase64Url = (base64: string) =>
  base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

/**
 * `registration_token` de `POST /api/UserTeacher`: `v1.{ts}.{firma}`, con la
 * firma HMAC-SHA256 del timestamp (en texto) y el secreto compartido que Core
 * valida con `backend_shared_secret`.
 *
 * Es una firma de origen para frenar altas automáticas, no un secreto fuerte:
 * va dentro del bundle. El timestamp es la hora del servidor, no la del móvil,
 * porque Core rechaza el token si se aparta más de `TOKEN_SKEW_SECONDS`.
 */
export function createRegistrationToken(
  secret: string | undefined = env.EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET,
  nowSeconds: number = serverNowSeconds(),
): string {
  if (!secret) {
    throw new Error("Falta EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET: no se puede firmar el registro.");
  }
  const timestamp = String(nowSeconds);
  const signature = toBase64Url(Base64.stringify(HmacSHA256(timestamp, secret)));
  return `${TOKEN_VERSION}.${timestamp}.${signature}`;
}
