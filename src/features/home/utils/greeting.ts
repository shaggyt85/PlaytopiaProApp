/** Franja del día para el saludo de Hoy. */
export type GreetingPeriod = "morning" | "afternoon" | "evening";

// Hora (0-23) a la que empieza cada saludo. Antes de las 6, buenas noches.
const MORNING_FROM = 6;
const AFTERNOON_FROM = 12;
const EVENING_FROM = 20;

/** Saludo según la hora: buenos días, buenas tardes o buenas noches (también de madrugada). */
export function greetingFor(hour: number): GreetingPeriod {
  if (hour >= MORNING_FROM && hour < AFTERNOON_FROM) return "morning";
  if (hour >= AFTERNOON_FROM && hour < EVENING_FROM) return "afternoon";
  return "evening";
}
