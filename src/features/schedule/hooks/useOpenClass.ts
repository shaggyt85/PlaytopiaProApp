import { useRouter } from "expo-router";
import { useCallback } from "react";

import type { ScheduleClass } from "../schemas/schedule.schema";
import { classDetailHref } from "../utils/classRoute";

/**
 * Abrir el detalle de una clase: lo usan la tarjeta de la tira, las filas de
 * Semana y Mes y la tarjeta de la próxima clase. La función es estable, así no
 * hay que pasar un `onPress` a través de la agenda y el `memo` de las filas sigue
 * sirviendo.
 */
export function useOpenClass() {
  const router = useRouter();
  return useCallback(
    (c: Pick<ScheduleClass, "db_id" | "id" | "class_date">) => router.push(classDetailHref(c)),
    [router],
  );
}
