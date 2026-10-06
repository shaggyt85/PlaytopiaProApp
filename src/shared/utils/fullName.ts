import { joinParts } from "@/shared/utils/joinParts";

/** Lo que hace falta para el nombre completo: el de un alumno o el del profesor. */
export interface PersonName {
  name: string;
  last_name: string;
}

/** El nombre completo, «Lucía Romero», sin espacios de más si falta el apellido. */
export const fullName = ({ name, last_name }: PersonName): string => joinParts([name, last_name], " ");
