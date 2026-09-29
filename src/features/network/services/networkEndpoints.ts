/** Rutas de Core de «Red de clubes» (Scalar, grupo Mobile Teacher). */
export const NETWORK_ENDPOINTS = {
  /** Las sedes donde trabaja el profesor del token. */
  MY_CLUBS: "/MobileTeacher/clubs",
  /** Las sedes a las que puede pedir unirse, paginadas (`page`, `size`). */
  JOINABLE_SCHOOLS: "/MobileTeacher/schools",
} as const;
