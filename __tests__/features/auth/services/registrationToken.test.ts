import { createHmac, timingSafeEqual } from "crypto";

import { createRegistrationToken } from "@/features/auth/services/registrationToken";
import { recordServerDate, resetServerClock } from "@/shared/utils/serverClock";

/**
 * Lo que hace Core en `validate_registration_token`
 * (crates/application/src/auth/registration_token.rs), con el HMAC de Node en
 * lugar del de la app: tres partes, "v1", timestamp dentro de la tolerancia y
 * firma base64url que coincide con HMAC-SHA256(secreto, timestamp).
 */
function coreAccepts(token: string, secret: string, nowSeconds: number, skew = 300): boolean {
  const parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1") return false;
  const ts = Number(parts[1]);
  if (!Number.isInteger(ts) || Math.abs(nowSeconds - ts) > skew) return false;
  const expected = createHmac("sha256", secret).update(parts[1]).digest();
  const provided = Buffer.from(parts[2], "base64url");
  return provided.length === expected.length && timingSafeEqual(provided, expected);
}

describe("createRegistrationToken", () => {
  afterEach(() => {
    resetServerClock();
    jest.restoreAllMocks();
  });

  it("sigue el formato v1.{timestamp}.{firma}", () => {
    expect(createRegistrationToken("secreto-de-prueba", 1790000000)).toBe(
      "v1.1790000000.frFy7tqfo4fc61g4KVKdZXwQNAHtqkvuVawhYNn1NeM",
    );
  });

  it("Core acepta la firma", () => {
    const token = createRegistrationToken("secreto-de-prueba", 1790000000);

    expect(coreAccepts(token, "secreto-de-prueba", 1790000000)).toBe(true);
  });

  it("la firma va en base64url sin relleno aunque el base64 lleve + / y =", () => {
    // Con este timestamp el base64 estándar es "sqIACV8opx+9t8C89Kon…zeU=".
    const token = createRegistrationToken("s", 1790000001);

    expect(token).toBe("v1.1790000001.sqIACV8opx-9t8C89KonjeNvF9WBHVVt0EGeai55zeU");
    expect(coreAccepts(token, "s", 1790000001)).toBe(true);
  });

  it("con otro secreto Core la rechaza", () => {
    const token = createRegistrationToken("secreto-de-prueba", 1790000000);

    expect(coreAccepts(token, "otro-secreto", 1790000000)).toBe(false);
  });

  it("firma con la hora del servidor, no con la del móvil", () => {
    // El móvil va 10 minutos adelantado respecto a Core.
    const serverMs = Date.UTC(2026, 8, 26, 12, 0, 0);
    jest.spyOn(Date, "now").mockReturnValue(serverMs + 10 * 60 * 1000);
    recordServerDate(new Date(serverMs).toUTCString());

    const token = createRegistrationToken("secreto-de-prueba");

    expect(token.split(".")[1]).toBe(String(serverMs / 1000));
    expect(coreAccepts(token, "secreto-de-prueba", serverMs / 1000)).toBe(true);
  });

  it("sin secreto no firma y lo dice", () => {
    expect(() => createRegistrationToken("", 1790000000)).toThrow(
      "Falta EXPO_PUBLIC_USER_TEACHER_SHARED_SECRET",
    );
  });
});
