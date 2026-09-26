/** JWT de prueba con los claims de Core (sin firma válida: la app no la verifica). */
export function createTestJwt(claims: Record<string, unknown>): string {
  const encode = (value: object) =>
    Buffer.from(JSON.stringify(value)).toString("base64url");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(claims)}.firma`;
}

/** Claims de un profesor válidos (RoleId 4). */
export const teacherClaims = (overrides: Record<string, unknown> = {}) => ({
  RoleId: 4,
  UserId: 42,
  DbId: 7,
  ClubId: 7,
  exp: 1_900_000_000,
  ...overrides,
});
