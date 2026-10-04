import { MINUTES_PER_HOUR } from "./classTiming";
import type { HourSpan } from "./hourSpan";

/** Dónde va una tarjeta en la tira: desde arriba y cuánto mide, en puntos. */
export interface BlockGeometry {
  top: number;
  height: number;
}

/** Un tramo de la tira que se estira: de `start` a `end` (minutos del día), `factor` veces más alto. */
export interface Stretch {
  start: number;
  end: number;
  factor: number;
}

/** La escala de la tira: de un minuto del día a su altura, y el alto total. */
export interface TimelineScale {
  yOf: (minutes: number) => number;
  height: number;
}

/**
 * La única escala de la vista Día: `hourHeight` puntos por hora y, dentro de cada
 * tramo estirado (clases que coinciden, apiladas: `layoutDay`), `factor` veces
 * más. La usan las tarjetas, las horas y los puntos del eje y la línea de ahora,
 * así siempre cuadran entre sí. Los tramos no se pisan entre ellos.
 */
export function timelineScale(span: HourSpan, hourHeight: number, stretches: readonly Stretch[] = []): TimelineScale {
  const perMinute = hourHeight / MINUTES_PER_HOUR;
  const first = span.start * MINUTES_PER_HOUR;
  const sorted = [...stretches].sort((a, b) => a.start - b.start);
  const yOf = (minutes: number) => {
    let y = (minutes - first) * perMinute;
    for (const stretch of sorted) {
      if (minutes <= stretch.start) break;
      y += (Math.min(minutes, stretch.end) - stretch.start) * perMinute * (stretch.factor - 1);
    }
    return y;
  };
  return { yOf, height: yOf(span.end * MINUTES_PER_HOUR) };
}

/**
 * Dónde va la línea de «ahora», o `null` si ahora cae fuera de la franja (no se
 * pinta). Con la misma escala que las clases: dentro de un tramo estirado cae en
 * su proporción.
 */
export function nowOffset(nowMinutes: number, span: HourSpan, scale: TimelineScale): number | null {
  if (nowMinutes < span.start * MINUTES_PER_HOUR || nowMinutes > span.end * MINUTES_PER_HOUR) return null;
  return scale.yOf(nowMinutes);
}
