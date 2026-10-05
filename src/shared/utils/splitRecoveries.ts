import type { ClassStudent } from "@/shared/schemas/schedule.schema";

/** Los alumnos de una clase, separados: los de su grupo y los que vienen a recuperar. */
interface SplitStudents {
  members: ClassStudent[];
  recoveries: ClassStudent[];
}

/**
 * Separa a los alumnos de una clase en los de su grupo y los que vienen a
 * recuperar en ella (`is_recovery`), cada parte en el orden del contrato. Único
 * sitio que lo decide: «Alumnos del grupo», cuántos inscritos y cuántos
 * recuperan en las tarjetas de la próxima clase.
 */
export function splitRecoveries(students: readonly ClassStudent[]): SplitStudents {
  const members: ClassStudent[] = [];
  const recoveries: ClassStudent[] = [];
  for (const student of students) (student.is_recovery ? recoveries : members).push(student);
  return { members, recoveries };
}
