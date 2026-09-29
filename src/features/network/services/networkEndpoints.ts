/** Rutas de Core de «Red de clubes» (Scalar, grupo Mobile Teacher). «Mis clubes» es compartido: `shared/services/myClubsService`. */
export const NETWORK_ENDPOINTS = {
  /** Las sedes a las que puede pedir unirse, paginadas (`page`, `size`). */
  JOINABLE_SCHOOLS: "/MobileTeacher/schools",
} as const;
