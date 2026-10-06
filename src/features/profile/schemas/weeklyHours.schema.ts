import { z } from "zod";

/**
 * Los días de una semana como los numera Core: "0" = domingo … "6" = sábado
 * (como JS y .NET). Es la clave de la semana de horas.
 */
export const WEEK_DAYS = ["0", "1", "2", "3", "4", "5", "6"] as const;
export type WeekDay = (typeof WEEK_DAYS)[number];

/**
 * El orden en que la app enseña la semana: de lunes a domingo, con las claves de
 * Core. Escrito una vez: lo usan el resumen de la disponibilidad y su editor.
 */
export const WEEK_DISPLAY_ORDER: readonly WeekDay[] = ["1", "2", "3", "4", "5", "6", "0"];

/** La última hora en la que se puede empezar: la de 23:00 a 24:00 (`LAST_HOUR` en Core). */
export const LAST_HOUR = 23;

/**
 * Una semana de horas (`WeeklyHoursDto` en Scalar): día → las horas en punto,
 * de 0 a `LAST_HOUR`, en las que empieza cada hora disponible. `{"1": [16, 17,
 * 18]}` son los lunes de 16:00 a 19:00. Un día sin horas no viene. La misma
 * regla que valida Core.
 */
export const WeeklyHoursSchema = z.partialRecord(
  z.enum(WEEK_DAYS),
  z.array(z.number().int().min(0).max(LAST_HOUR)),
);
export type WeeklyHours = z.infer<typeof WeeklyHoursSchema>;
