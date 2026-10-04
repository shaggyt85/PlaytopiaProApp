import { MINUTES_PER_HOUR } from "./classTiming";
import type { Stretch } from "./timelineGeometry";

interface Slot {
  id: number;
  /** Minutos desde las 00:00. */
  start: number;
  end: number;
}

/** Dónde va una tarjeta: desde el inicio de su grupo y cuánto mide, en puntos. */
export interface Stacked {
  /** Minuto en que empieza su grupo: la tira lo sitúa con su escala (`timelineScale`). */
  groupStart: number;
  top: number;
  height: number;
}

/** El reparto del día: dónde va cada tarjeta y qué tramos de la tira se estiran. */
export interface DayLayout {
  blocks: Map<number, Stacked>;
  stretches: Stretch[];
}

/** Por debajo de medio punto no se estira: solo es el redondeo de la cuenta. */
const STRETCH_EPSILON = 0.5;

/**
 * Coloca las clases del día a `hourHeight` puntos por hora. Las que coinciden van
 * **una debajo de otra**, a todo el ancho, y el tramo de horas que ocupan se
 * estira lo justo para que quepan sin pisarse (ni el prototipo, que las empuja
 * hacia abajo, ni las columnas de antes lo hacían).
 *
 * - Se agrupan mientras se pisen sus tarjetas, no solo sus horas: una clase
 *   corta mide como mínimo `minHeight`, y la siguiente no puede empezar debajo.
 * - Dentro del grupo, en orden de inicio: cada una empieza en su hora o justo
 *   debajo de la anterior, con su alto (su duración o el mínimo).
 * - Si el grupo no cabe en su tramo, ese tramo se estira (`Stretch`) y el resto
 *   del día no cambia. Una clase sola, o las que no coinciden, igual que siempre.
 */
export function layoutDay(slots: readonly Slot[], hourHeight: number, minHeight: number): DayLayout {
  const perMinute = hourHeight / MINUTES_PER_HOUR;
  const minMinutes = minHeight / perMinute;
  /** Hasta dónde llega su tarjeta, en minutos: su fin o, si es corta, su alto mínimo. */
  const reach = (slot: Slot) => Math.max(slot.end, slot.start + minMinutes);
  const sorted = [...slots].sort((a, b) => a.start - b.start || a.end - b.end || a.id - b.id);

  const blocks = new Map<number, Stacked>();
  const stretches: Stretch[] = [];
  let group: Slot[] = [];
  let groupEnd = -Infinity;

  const closeGroup = () => {
    if (group.length === 0) return;
    const start = group[0].start;
    let bottom = 0;
    for (const slot of group) {
      const height = Math.max(minHeight, (slot.end - slot.start) * perMinute);
      const top = Math.max((slot.start - start) * perMinute, bottom);
      blocks.set(slot.id, { groupStart: start, top, height });
      bottom = top + height;
    }
    const natural = (groupEnd - start) * perMinute;
    if (bottom - natural > STRETCH_EPSILON) stretches.push({ start, end: groupEnd, factor: bottom / natural });
    group = [];
    groupEnd = -Infinity;
  };

  for (const slot of sorted) {
    if (slot.start >= groupEnd) closeGroup();
    group.push(slot);
    groupEnd = Math.max(groupEnd, reach(slot));
  }
  closeGroup();

  return { blocks, stretches };
}
