import { problemKey } from "@/shared/schemas/problemDetail.schema";
import { isHttpError } from "@/shared/services/HttpError";

/**
 * ¿Es este error el problema de Core con ese `type`? (la clave sin
 * `urn:playtopia:problem:`, la misma de `errors.byType`). Para cuando la
 * pantalla tiene que reaccionar distinto a un error concreto: se decide por el
 * `type`, nunca por el texto del `detail`.
 */
export const isProblem = (error: unknown, key: string): boolean =>
  isHttpError(error) && problemKey(error.type) === key;
