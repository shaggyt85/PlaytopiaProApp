/** Rutas de Core del flujo de acceso (Scalar, grupo Auth). */
export const AUTH_ENDPOINTS = {
  CHECK_EMAIL: "/auth/check-email",
  SIGN_IN: "/auth/login/teacher",
  /** Alta de profesor (grupo Users → Teachers). Público: lo protege el registration_token. */
  SIGN_UP: "/UserTeacher",
  /** Perfil del profesor: de él se lee y se acepta la versión de los términos. */
  TEACHER: (teacherId: number) => `/UserTeacher/${teacherId}`,
} as const;
