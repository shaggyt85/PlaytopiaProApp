import { useCallback, useState } from "react";

import { addDays } from "../utils/scheduleDates";

/**
 * El día que se ve en la agenda, con las flechas: › el siguiente y ‹ el
 * anterior. Se guarda como distancia a hoy (0 = hoy), no como fecha: si pasa la
 * medianoche con la app abierta en «hoy», la vista pasa sola al día nuevo.
 */
export function useSelectedDay(today: string) {
  const [offset, setOffset] = useState(0);
  const goPrevious = useCallback(() => setOffset((days) => days - 1), []);
  const goNext = useCallback(() => setOffset((days) => days + 1), []);

  return { date: addDays(today, offset), isToday: offset === 0, goPrevious, goNext };
}
