import { useQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

import type { ColorPair } from "@/shared/config/theme";
import { useTheme } from "@/shared/hooks/useTheme";
import type { ScheduleClass, ScheduleResponse } from "@/shared/schemas/schedule.schema";
import { scheduleService, type ScheduleReader } from "@/shared/services/scheduleService";
import { useSessionUserId } from "@/shared/store/sessionStore";

import { monthScheduleQuery } from "../services/monthScheduleQuery";
import { classColors } from "../utils/classColors";

/** La clase y su color en su día: el mismo que lleva en Día, Semana y Mes. */
interface ClassWithColor {
  item: ScheduleClass;
  colors: ColorPair;
}

/**
 * Una clase para su detalle, de la misma caché del mes que la agenda
 * (`monthScheduleQuery(date)`): al venir de la agenda se abre al instante, sin
 * pedir nada; si esa caché no está, se pide ese mes.
 *
 * `item` es `null` si la respuesta no la trae (el club la ha borrado o movida):
 * la pantalla dice «Clase no encontrada». Su color sale de las clases de su día
 * (`classColors`), como en la agenda. El `select` solo cambia si cambian la
 * escuela, la clase o la paleta, así TanStack no la vuelve a buscar en cada
 * pintado.
 */
export function useClassDetail(
  dbId: number,
  classId: number,
  date: string,
  service: ScheduleReader = scheduleService,
) {
  const teacherId = useSessionUserId();
  const palette = useTheme().clubColors;
  const recipe = useMemo(() => monthScheduleQuery(teacherId, date, service), [teacherId, date, service]);
  const selectClass = useCallback(
    (data: ScheduleResponse): ClassWithColor | null => {
      const item = data.classes.find((c) => c.db_id === dbId && c.id === classId);
      if (!item) return null;
      const sameDay = data.classes.filter((c) => c.class_date === item.class_date);
      // `classColors` da color a todas las del día, también a esta: el primero de
      // la paleta solo contenta al tipo.
      return { item, colors: classColors(sameDay, palette).get(item.id) ?? palette[0] };
    },
    [dbId, classId, palette],
  );
  const query = useQuery({ ...recipe, select: selectClass });

  return {
    item: query.data?.item ?? null,
    /** El color de la clase en su día; `undefined` si no está. */
    colors: query.data?.colors,
    /** Ya llegó la respuesta del mes (aunque no traiga la clase). */
    hasData: query.data !== undefined,
    error: query.error,
    refetch: query.refetch,
  };
}
