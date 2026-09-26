/**
 * Roles de Core (`crates/shared/src/roles.rs`). La fuente de verdad es el
 * claim `RoleId` del JWT; Core rechaza con 403 a quien no tenga el rol que
 * pide cada endpoint (`require_teacher`).
 */
export const ROLES = {
  SUPER_ADMIN: 0,
  ADMIN: 1,
  EMPLOY: 2,
  STUDENT: 3,
  TEACHER: 4,
} as const;

export type RoleId = (typeof ROLES)[keyof typeof ROLES];
