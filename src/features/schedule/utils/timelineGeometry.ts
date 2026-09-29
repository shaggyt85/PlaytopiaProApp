import { MINUTES_PER_HOUR } from "./classTiming";
import type { HourSpan } from "./hourSpan";

/** Dónde va una tarjeta en la tira: desde arriba y cuánto mide, en puntos. */
export interface BlockGeometry {
  top: number;
  height: number;
}

/**
 * La posición de una clase en la tira: su inicio dentro de la franja y su
 * duración, a `hourHeight` puntos por hora, con un alto mínimo para que una
 * clase corta se pueda leer.
 */
export function blockGeometry(
  minutes: { start: number; end: number },
  span: HourSpan,
  hourHeight: number,
  minHeight: number,
): BlockGeometry {
  const toPoints = (m: number) => (m / MINUTES_PER_HOUR) * hourHeight;
  return {
    top: toPoints(minutes.start - span.start * MINUTES_PER_HOUR),
    height: Math.max(minHeight, toPoints(minutes.end - minutes.start)),
  };
}

/**
 * Dónde va la línea de «ahora», o `null` si ahora cae fuera de la franja (no se
 * pinta).
 */
export function nowOffset(nowMinutes: number, span: HourSpan, hourHeight: number): number | null {
  const fromStart = nowMinutes - span.start * MINUTES_PER_HOUR;
  const length = (span.end - span.start) * MINUTES_PER_HOUR;
  if (fromStart < 0 || fromStart > length) return null;
  return (fromStart / MINUTES_PER_HOUR) * hourHeight;
}
