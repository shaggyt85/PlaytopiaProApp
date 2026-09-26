import { HttpError, isHttpError } from "@/shared/services/HttpError";

describe("HttpError", () => {
  it("fromResponse lleva el status, el problem y su type", () => {
    const error = HttpError.fromResponse(409, {
      type: "urn:playtopia:problem:email-taken",
      status: 409,
      detail: "El email ya está registrado",
    });

    expect(error.kind).toBe("http");
    expect(error.status).toBe(409);
    expect(error.type).toBe("urn:playtopia:problem:email-taken");
    expect(error.message).toBe("El email ya está registrado");
    expect(isHttpError(error)).toBe(true);
  });

  it("un cuerpo que no es ProblemDetail no rompe: sin problem ni type", () => {
    const error = HttpError.fromResponse(502, "<html>Bad Gateway</html>");

    expect(error.problem).toBeUndefined();
    expect(error.type).toBeUndefined();
    expect(error.message).toBe("HTTP 502");
  });

  it("lee Retry-After en segundos e ignora valores no válidos", () => {
    expect(HttpError.fromResponse(429, {}, "30").retryAfter).toBe(30);
    expect(HttpError.fromResponse(429, {}, "mañana").retryAfter).toBeUndefined();
    expect(HttpError.fromResponse(429, {}).retryAfter).toBeUndefined();
  });

  it("network y timeout se distinguen por kind", () => {
    expect(HttpError.network().kind).toBe("network");
    expect(HttpError.timeout().kind).toBe("timeout");
  });

  it("isHttpError rechaza otros errores", () => {
    expect(isHttpError(new Error("otro"))).toBe(false);
  });
});
