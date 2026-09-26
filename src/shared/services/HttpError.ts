import {
  parseProblemDetail,
  type ProblemDetail,
} from "@/shared/schemas/problemDetail.schema";

/**
 * Qué falló:
 * - `http`: el servidor respondió con un error (trae `status` y, si es de
 *   Core, su `problem` RFC 9457).
 * - `network`: no hubo respuesta.
 * - `timeout`: la respuesta no llegó a tiempo.
 */
export type HttpErrorKind = "http" | "network" | "timeout";

/**
 * Único tipo de error que sale del cliente HTTP. Las pantallas no manejan
 * errores de axios ni formatos propios: solo este.
 *
 * No lleva textos para el usuario: el mensaje visible se traduce por `type`
 * (guía §6). Así el error no depende del idioma ni de la pantalla.
 */
export class HttpError extends Error {
  readonly kind: HttpErrorKind;
  readonly status?: number;
  readonly problem?: ProblemDetail;
  /** Segundos que pide esperar el servidor (cabecera Retry-After, p. ej. en 429). */
  readonly retryAfter?: number;

  private constructor(params: {
    kind: HttpErrorKind;
    message: string;
    status?: number;
    problem?: ProblemDetail;
    retryAfter?: number;
  }) {
    super(params.message);
    this.name = "HttpError";
    this.kind = params.kind;
    this.status = params.status;
    this.problem = params.problem;
    this.retryAfter = params.retryAfter;
  }

  /** Clave de traducción y de decisión: el `type` del ProblemDetail. */
  get type(): string | undefined {
    return this.problem?.type;
  }

  static fromResponse(
    status: number,
    body: unknown,
    retryAfterHeader?: string | null,
  ): HttpError {
    const problem = parseProblemDetail(body);
    const retryAfter = Number(retryAfterHeader);
    return new HttpError({
      kind: "http",
      // Para logs y Sentry; nunca se enseña al usuario.
      message: problem?.detail ?? problem?.title ?? `HTTP ${status}`,
      status,
      problem,
      retryAfter: Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter : undefined,
    });
  }

  static network(): HttpError {
    return new HttpError({ kind: "network", message: "Network Error" });
  }

  static timeout(): HttpError {
    return new HttpError({ kind: "timeout", message: "Request Timeout" });
  }
}

export const isHttpError = (error: unknown): error is HttpError =>
  error instanceof HttpError;
