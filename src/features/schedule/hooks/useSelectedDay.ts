import { useCallback, useState } from "react";

import { addDays, daysBetween } from "../utils/scheduleDates";
import { stepDate, type ScheduleView } from "../utils/scheduleViews";

/**
 * El día que se ve en la agenda, el mismo en las tres vistas. Las flechas lo
 * mueven según la vista (un día, una semana o un mes) y `select` lo lleva al día
 * tocado en la tira de la semana o en el mes.
 *
 * Se guarda como distancia a hoy (0 = hoy), no como fecha: si pasa la medianoche
 * con la app abierta en «hoy», la vista pasa sola al día nuevo.
 */
export function useSelectedDay(today: string) {
  const [offset, setOffset] = useState(0);

  const move = useCallback(
    (view: ScheduleView, direction: 1 | -1) =>
      setOffset((days) => daysBetween(today, stepDate(addDays(today, days), view, direction))),
    [today],
  );
  const goPrevious = useCallback((view: ScheduleView) => move(view, -1), [move]);
  const goNext = useCallback((view: ScheduleView) => move(view, 1), [move]);
  const select = useCallback((date: string) => setOffset(daysBetween(today, date)), [today]);

  return { date: addDays(today, offset), isToday: offset === 0, goPrevious, goNext, select };
}
