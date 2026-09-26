import { decodeSessionClaims } from "@/shared/utils/jwt";

import { createTestJwt, teacherClaims } from "../../helpers/jwt";

describe("decodeSessionClaims", () => {
  it("lee rol, usuario, escuela y caducidad del token", () => {
    expect(decodeSessionClaims(createTestJwt(teacherClaims()))).toEqual({
      roleId: 4,
      userId: 42,
      dbId: 7,
      expiresAt: 1_900_000_000,
    });
  });

  it("no expone ClubId: en Core es la escuela, no la sucursal", () => {
    const claims = decodeSessionClaims(createTestJwt(teacherClaims({ ClubId: 99 })));
    expect(claims).not.toHaveProperty("clubId");
    expect(claims?.dbId).toBe(7);
  });

  it("lee los claims aunque el token haya caducado", () => {
    expect(decodeSessionClaims(createTestJwt(teacherClaims({ exp: 1 })))?.roleId).toBe(4);
  });

  it("devuelve undefined con tokens mal formados o sin los claims", () => {
    expect(decodeSessionClaims("no-es-un-jwt")).toBeUndefined();
    expect(decodeSessionClaims("a.@@@.c")).toBeUndefined();
    expect(decodeSessionClaims(createTestJwt({ sub: "x" }))).toBeUndefined();
  });
});
