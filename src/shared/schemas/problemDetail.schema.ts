import { z } from "zod";

/**
 * Error de Core en formato RFC 9457 (Problem Details, application/problem+json).
 *
 * `looseObject` conserva los miembros extendidos (§3.2), como
 * `pending_consents` o `conflicts`: son los que dejan a una pantalla
 * reaccionar sin otra llamada.
 *
 * `type` es la clave estable (`urn:playtopia:problem:…`) con la que se
 * traduce el error; `detail` es prosa para logs y nunca se muestra.
 */
export const ProblemDetailSchema = z.looseObject({
  // RFC 9457 §3.1.1: si falta, equivale a "about:blank".
  type: z.string().default("about:blank"),
  title: z.string().optional(),
  status: z.number().int().optional(),
  detail: z.string().optional(),
  instance: z.string().optional(),
});

export type ProblemDetail = z.infer<typeof ProblemDetailSchema>;

/** Devuelve el ProblemDetail si el cuerpo lo es; si no, undefined. */
export function parseProblemDetail(body: unknown): ProblemDetail | undefined {
  const result = ProblemDetailSchema.safeParse(body);
  return result.success ? result.data : undefined;
}
