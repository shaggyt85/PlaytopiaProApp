/** Rutas de Core del flujo de acceso (Scalar, grupo Auth). */
export const AUTH_ENDPOINTS = {
  CHECK_EMAIL: "/auth/check-email",
  SIGN_IN: "/auth/login/teacher",
  /** Pide el correo de recuperación (grupo Password Recovery). Público. */
  PASSWORD_RECOVERY: "/PassRecovery/request",
  /** Alta de profesor (grupo Users → Teachers). Público: lo protege el registration_token. */
  SIGN_UP: "/UserTeacher",
} as const;
