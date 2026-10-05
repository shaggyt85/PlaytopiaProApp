import type { StudentName } from "@/shared/schemas/schedule.schema";
import { joinParts } from "@/shared/utils/joinParts";

/** El nombre completo de un alumno, «Lucía Romero», sin espacios de más si falta el apellido. */
export const studentName = ({ name, last_name }: StudentName): string => joinParts([name, last_name], " ");
