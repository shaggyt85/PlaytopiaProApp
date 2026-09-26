import { parseProblemDetail } from "@/shared/schemas/problemDetail.schema";

describe("parseProblemDetail", () => {
  it("lee un ProblemDetail de Core y conserva sus miembros extendidos", () => {
    const problem = parseProblemDetail({
      type: "urn:playtopia:problem:email-taken",
      title: "Conflict",
      status: 409,
      detail: "El email ya está registrado",
      pending_consents: [{ id: 1 }],
    });

    expect(problem?.type).toBe("urn:playtopia:problem:email-taken");
    expect(problem?.status).toBe(409);
    expect(problem?.pending_consents).toEqual([{ id: 1 }]);
  });

  it("usa about:blank cuando falta el type (RFC 9457 §3.1.1)", () => {
    expect(parseProblemDetail({ status: 500 })?.type).toBe("about:blank");
  });

  it("devuelve undefined si el cuerpo no es un ProblemDetail", () => {
    expect(parseProblemDetail("<html>502</html>")).toBeUndefined();
    expect(parseProblemDetail(undefined)).toBeUndefined();
  });
});
