/**
 * Las rutas de Core que usa la app, todas aquí y agrupadas como en Scalar
 * (`https://core-dev.playtopiax.com/docs`). Relativas a
 * `EXPO_PUBLIC_API_BASE_URL`, que ya termina en `/api`.
 *
 * Son configuración, como la URL base: describen el backend, no una pantalla.
 * Por eso no viven junto a su servicio: un servicio puede pasar de una feature a
 * `shared` (o al revés) sin que haya que acordarse de mover sus rutas.
 */

/** Una clase del profesor del token: de ella cuelga lo que se hace con una clase. */
const teacherClass = (dbId: number, classId: number) => `/MobileTeacher/classes/${dbId}/${classId}`;

export const ENDPOINTS = {
  /** Grupo Auth (y Password Recovery). Públicas, salvo el refresco. */
  AUTH: {
    CHECK_EMAIL: "/auth/check-email",
    SIGN_IN: "/auth/login/teacher",
    /** Tokens nuevos con el refresh token. Core lo rota: el usado deja de valer. */
    REFRESH: "/auth/refresh",
    /** Pide el correo de recuperación (con `scope: "teacher"`). */
    PASSWORD_RECOVERY: "/PassRecovery/request",
  },

  /** Grupo Users → Teachers. */
  TEACHERS: {
    /** Alta de profesor. Pública: la protege el `registration_token`. */
    SIGN_UP: "/UserTeacher",
    /** El perfil del profesor: `GET` para leerlo, `PATCH` para cambiarlo. */
    PROFILE: (teacherId: number) => `/UserTeacher/${teacherId}`,
  },

  /** Grupo Mobile Teacher: todo del profesor del token. */
  MOBILE_TEACHER: {
    /** Las sedes donde trabaja («Mis clubes»). */
    CLUBS: "/MobileTeacher/clubs",
    /** Los deportes y especialidades que puede elegir en su perfil, traducidos. */
    SPORTS: "/MobileTeacher/sports",
    /** Las sedes a las que puede pedir unirse, paginadas (`page`, `size`). */
    JOINABLE_SCHOOLS: "/MobileTeacher/schools",
    /** Sus clases entre dos fechas (`from`, `to`) y la próxima. */
    CLASSES: "/MobileTeacher/classes",
    /**
     * La marca de asistencia de un alumno en una clase. La clase es la del
     * alumno (`class_id`: su plaza, si recupera).
     */
    ATTENDANCE: (dbId: number, classId: number, studentId: number) =>
      `${teacherClass(dbId, classId)}/attendance/${studentId}`,
    /** La clase anterior del grupo de una clase. */
    PREVIOUS: (dbId: number, classId: number) => `${teacherClass(dbId, classId)}/previous`,
    /**
     * El historial de asistencia de los alumnos del grupo de una clase, todos de
     * una vez: cualquier clase del grupo da el mismo.
     */
    GROUP_ATTENDANCE: (dbId: number, classId: number) => `${teacherClass(dbId, classId)}/group-attendance`,
  },
} as const;
