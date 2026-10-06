/** Un tramo de horas seguidas: de `start` a `end` en punto (`end` puede ser 24). */
export interface HourRange {
  start: number;
  end: number;
}

/**
 * Las horas de un día (las que empieza cada hora disponible, como las guarda
 * Core) como tramos: las seguidas se juntan. `[16, 17, 18]` es 16–19 y
 * `[9, 10, 17]` son 9–11 y 17–18. Solo calcula: escribirlos es de quien los
 * enseña. Lo usan el resumen de la disponibilidad y su editor.
 */
export function weekRanges(hours: readonly number[]): HourRange[] {
  const sorted = [...new Set(hours)].sort((a, b) => a - b);
  const ranges: HourRange[] = [];
  for (const hour of sorted) {
    const last = ranges.at(-1);
    if (last && last.end === hour) last.end = hour + 1;
    else ranges.push({ start: hour, end: hour + 1 });
  }
  return ranges;
}
