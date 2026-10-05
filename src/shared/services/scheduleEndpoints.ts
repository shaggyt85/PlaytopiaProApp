/** Rutas de Core de la agenda (Scalar, grupo Mobile Teacher). */
export const SCHEDULE_ENDPOINTS = {
  /** Las clases del profesor del token entre dos fechas (`from`, `to`) y la próxima. */
  CLASSES: "/MobileTeacher/classes",
  /**
   * La marca de asistencia de un alumno en una clase del profesor del token. La
   * clase es la del alumno (`class_id`: su plaza, si recupera).
   */
  ATTENDANCE: (dbId: number, classId: number, studentId: number) =>
    `/MobileTeacher/classes/${dbId}/${classId}/attendance/${studentId}`,
  /** La clase anterior del grupo de una clase del profesor del token. */
  PREVIOUS: (dbId: number, classId: number) => `/MobileTeacher/classes/${dbId}/${classId}/previous`,
} as const;
