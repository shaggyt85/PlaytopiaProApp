/** Dónde va una tarjeta cuando comparte hora con otras. */
export interface Placement {
  /** Su columna, de 0 a `columns - 1`. */
  column: number;
  /** Cuántas columnas tiene su grupo de clases solapadas: su ancho es 1/columns. */
  columns: number;
}

interface Slot {
  id: number;
  /** Minutos desde las 00:00. */
  start: number;
  end: number;
}

/**
 * Reparte en columnas las clases que coinciden, como en el calendario del
 * prototipo («Cantera Tarde» y «Clinic Tactical» lado a lado).
 *
 * Las clases se agrupan mientras se solapen (una que empieza justo cuando otra
 * termina no se solapa) y, dentro de cada grupo, cada una ocupa la primera
 * columna que ya ha quedado libre. Todas las del grupo comparten el ancho.
 */
export function layoutDay(slots: readonly Slot[]): Map<number, Placement> {
  const placements = new Map<number, Placement>();
  const sorted = [...slots].sort((a, b) => a.start - b.start || a.end - b.end || a.id - b.id);

  let group: { id: number; column: number }[] = [];
  let groupEnd = -Infinity;
  /** Cuándo queda libre cada columna del grupo en curso. */
  let columnEnds: number[] = [];

  const closeGroup = () => {
    for (const { id, column } of group) placements.set(id, { column, columns: columnEnds.length });
    group = [];
    columnEnds = [];
  };

  for (const slot of sorted) {
    if (slot.start >= groupEnd) closeGroup();
    let column = columnEnds.findIndex((end) => end <= slot.start);
    if (column === -1) {
      column = columnEnds.length;
      columnEnds.push(slot.end);
    } else {
      columnEnds[column] = slot.end;
    }
    group.push({ id: slot.id, column });
    groupEnd = group.length === 1 ? slot.end : Math.max(groupEnd, slot.end);
  }
  closeGroup();

  return placements;
}
