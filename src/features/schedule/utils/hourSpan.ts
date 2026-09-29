import { MINUTES_PER_DAY, MINUTES_PER_HOUR } from "./classTiming";

/** Franja de horas de la tira: `start` y `end` en horas enteras, de 0 a 24. */
export interface HourSpan {
  start: number;
  end: number;
}

const LAST_HOUR = MINUTES_PER_DAY / MINUTES_PER_HOUR;

/**
 * La franja que se ve: la configurada, ampliada lo justo para que quepan todas
 * las clases del día (en horas enteras) y sin salirse de 00–24. Así una clase de
 * un club de 24 horas fuera de la franja nunca se queda sin ver.
 */
export function visibleHours(
  configured: HourSpan,
  classes: readonly { start: number; end: number }[],
): HourSpan {
  const first = Math.min(configured.start * MINUTES_PER_HOUR, ...classes.map((c) => c.start));
  const last = Math.max(configured.end * MINUTES_PER_HOUR, ...classes.map((c) => c.end));
  return {
    start: Math.max(0, Math.floor(first / MINUTES_PER_HOUR)),
    end: Math.min(LAST_HOUR, Math.ceil(last / MINUTES_PER_HOUR)),
  };
}
