/** Franja del día para el saludo de Hoy. */
export type GreetingPeriod = "morning" | "afternoon" | "evening";

/**
 * Saludo según la hora (0-23): buenos días de 6 a 12, buenas tardes de 12 a
 * 20 y buenas noches el resto (también de madrugada).
 */
export function greetingFor(hour: number): GreetingPeriod {
  if (hour >= 6 && hour < 12) return "morning";
  if (hour >= 12 && hour < 20) return "afternoon";
  return "evening";
}
