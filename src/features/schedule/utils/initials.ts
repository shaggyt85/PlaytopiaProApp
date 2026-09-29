import type { StudentName } from "../schemas/schedule.schema";

/**
 * Las iniciales de un alumno para su círculo: la primera letra del nombre y la
 * del primer apellido («Lucía Romero» → «LR»). Por letras y no por unidades de
 * código, para que una «Á» o un emoji no se partan.
 */
export function initials({ name, last_name }: StudentName): string {
  const first = (text: string) => Array.from(text.trim())[0] ?? "";
  return (first(name) + first(last_name)).toUpperCase();
}
