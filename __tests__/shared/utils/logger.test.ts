import { createLogger, redact } from "@/shared/utils/logger";

describe("logger", () => {
  it("respeta el nivel mínimo", () => {
    const sink = jest.fn();
    const log = createLogger({ minLevel: "warn", sink });

    log.debug("detalle");
    log.info("info");
    log.warn("aviso");
    log.error("fallo");

    expect(sink.mock.calls.map(([level]) => level)).toEqual(["warn", "error"]);
  });

  it("nunca deja salir tokens, contraseñas ni cabeceras de autorización", () => {
    const sink = jest.fn();
    const log = createLogger({ minLevel: "debug", sink });

    log.error("petición fallida", {
      url: "/auth/login/teacher",
      body: { email: "ana@club.com", password: "secreta" },
      headers: { Authorization: "Bearer abc" },
      tokens: [{ refresh_token: "xyz" }],
    });

    const context = sink.mock.calls[0][2];
    expect(JSON.stringify(context)).not.toMatch(/secreta|abc|xyz/);
    expect(context.body.email).toBe("ana@club.com");
  });
});

describe("redact", () => {
  it("deja intactos los valores que no son objetos", () => {
    expect(redact("texto")).toBe("texto");
    expect(redact(42)).toBe(42);
    expect(redact(null)).toBeNull();
  });
});
