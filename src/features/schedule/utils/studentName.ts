import { joinParts } from "@/shared/utils/joinParts";

import type { StudentName } from "../schemas/schedule.schema";

/** El nombre completo de un alumno, «Lucía Romero», sin espacios de más si falta el apellido. */
export const studentName = ({ name, last_name }: StudentName): string => joinParts([name, last_name], " ");
