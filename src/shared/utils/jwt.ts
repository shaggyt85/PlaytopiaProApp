import { z } from "zod";

/**
 * Claims del access token de Core que usa la app (nombres en PascalCase por
 * compatibilidad con .NET).
 *
 * `ClubId` NO se lee a propósito: Core lo rellena con el `db_id` (la
 * escuela), no con la sucursal. La sucursal activa sale de su endpoint.
 */
const ClaimsSchema = z.object({
  RoleId: z.number().int(),
  UserId: z.number().int(),
  DbId: z.number().int(),
  exp: z.number().int(),
});

export interface SessionClaims {
  roleId: number;
  userId: number;
  /** La escuela (tenant). */
  dbId: number;
  /** Caducidad del access token, en segundos UNIX. */
  expiresAt: number;
}

const base64UrlDecode = (segment: string): string => {
  const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  return atob(padded);
};

/**
 * Lee los claims de un JWT sin verificar la firma. Solo para decidir la
 * navegación: quien verifica es Core en cada petición. Funciona aunque el
 * token haya caducado. Devuelve undefined si el token no tiene el formato
 * esperado.
 */
export function decodeSessionClaims(token: string): SessionClaims | undefined {
  try {
    const payload = token.split(".")[1];
    if (!payload) return undefined;
    const parsed = ClaimsSchema.safeParse(JSON.parse(base64UrlDecode(payload)));
    if (!parsed.success) return undefined;
    const { RoleId, UserId, DbId, exp } = parsed.data;
    return { roleId: RoleId, userId: UserId, dbId: DbId, expiresAt: exp };
  } catch {
    return undefined;
  }
}
