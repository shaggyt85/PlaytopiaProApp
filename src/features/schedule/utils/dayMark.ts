/** Cómo se ve un día en la tira de la semana y en el mes: el elegido, hoy (si no es el elegido) o cualquier otro. */
export type DayMark = "selected" | "today" | "other";

/** El aspecto de \`day\`: el elegido si es \`selected\`, si no hoy, y si no los demás. */
export const dayMark = (day: string, selected: string | null, today: string): DayMark =>
  day === selected ? "selected" : day === today ? "today" : "other";
