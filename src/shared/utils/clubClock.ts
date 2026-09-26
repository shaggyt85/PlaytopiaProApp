import { dayjs } from "@/shared/config/dayjs";

import { serverNow } from "./serverClock";

/**
 * La hora del club, espejo de `club_clock.rs` de Core (mismos nombres y
 * mismas reglas):
 *
 * - `class_date` + `class_time` de Core son la hora **de pared del club**
 *   (las 18:00 son las 18:00 en la pista), sin zona. Se muestran tal cual y
 *   nunca se convierten con la zona del móvil.
 * - Los instantes (timestamps, ISO con Z) sí se pasan a la zona del club.
 * - "Ahora" sale de `serverNow()`, no del reloj del móvil.
 *
 * La zona se recibe siempre como parámetro (no hay una global). En Core es
 * por escuela (`db_id`): la de la escuela de la sucursal activa.
 */

/** Zona por defecto de Core (`DEFAULT_TIMEZONE`) mientras no la exponga a la app. */
export const DEFAULT_CLUB_TIMEZONE = "Europe/Madrid";

// Mismo límite que Core para saltar un hueco del cambio de hora.
const MAX_DST_GAP_MINUTES = 120;
const MINUTE_MS = 60_000;
const DAY_MS = 24 * 60 * MINUTE_MS;

/** La hora de pared de un instante en una zona, como ms "UTC" (para comparar y restar). */
function wallMs(instantMs: number, tz: string): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: tz,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(instantMs)
      .map((part) => [part.type, part.value]),
  );
  return Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  );
}

/**
 * Una fecha/hora de pared de Core como ms "UTC": sirve para comparar horas de
 * pared y para formatearlas con timeZone "UTC" sin que la zona del móvil las
 * desplace.
 */
export const wallAsUtcMs = (date: string, time = "00:00:00"): number =>
  Date.parse(`${date}T${time}Z`);

/** Desfase de la zona (ms) en un instante: hora de pared menos UTC. */
const offsetMs = (instantMs: number, tz: string) => wallMs(instantMs, tz) - instantMs;

/** La zona si es un identificador IANA válido; si no, la de por defecto (como Core). */
export function parseTimezone(tz: string | undefined): string {
  if (!tz) return DEFAULT_CLUB_TIMEZONE;
  try {
    new Intl.DateTimeFormat("en", { timeZone: tz });
    return tz;
  } catch {
    return DEFAULT_CLUB_TIMEZONE;
  }
}

/** Qué día es hoy para el club (`YYYY-MM-DD`). */
export function clubToday(tz: string, nowMs: number = serverNow()): string {
  return dayjs(nowMs).tz(parseTimezone(tz)).format("YYYY-MM-DD");
}

/**
 * El instante (ms UNIX) en que ocurre algo del club a una fecha y hora de
 * pared. Si esa hora no existe (el reloj la salta), avanza a la primera que
 * sí; si existe dos veces (se retrasa el reloj), toma la primera.
 */
export function clubInstant(date: string, time: string, tz: string): number {
  const zone = parseTimezone(tz);
  const wall = wallAsUtcMs(date, time);

  for (let minutes = 0; minutes < MAX_DST_GAP_MINUTES; minutes++) {
    const candidate = wall + minutes * MINUTE_MS;
    // Los dos desfases posibles son el de la víspera y el del día siguiente.
    // Una hora de pared existe si alguno de ellos la reproduce; si la
    // reproducen los dos (hora repetida), se toma la primera.
    const instants = [offsetMs(candidate - DAY_MS, zone), offsetMs(candidate + DAY_MS, zone)]
      .map((offset) => candidate - offset)
      .filter((instant) => wallMs(instant, zone) === candidate);
    if (instants.length > 0) return Math.min(...instants);
  }
  // Inalcanzable con zonas reales; preferible a romper la pantalla.
  return wall;
}

/** Un instante (ms, segundos*1000 o ISO) visto en la zona del club. */
export function toClubTime(instant: number | string | Date, tz: string) {
  return dayjs(instant).tz(parseTimezone(tz));
}

/** "Ahora" en la zona del club, con la hora del servidor. */
export function clubNow(tz: string) {
  return toClubTime(serverNow(), tz);
}

/** ¿Ya empezó esta clase? Con la hora del servidor y en la zona del club. */
export function hasClassStarted(
  date: string,
  time: string,
  tz: string,
  nowMs: number = serverNow(),
): boolean {
  return nowMs >= clubInstant(date, time, tz);
}
