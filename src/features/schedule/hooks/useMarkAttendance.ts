import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { AttendanceStatus, ScheduleClass, ScheduleResponse } from "@/shared/schemas/schedule.schema";
import {
  scheduleKeys,
  scheduleService,
  type AttendanceTarget,
  type IScheduleService,
} from "@/shared/services/scheduleService";
import { alertError } from "@/shared/utils/alertError";

import { withAttendance, withStudentMark } from "../utils/withAttendance";

interface MarkAttendance {
  target: AttendanceTarget;
  status: AttendanceStatus;
}

/**
 * Marca si un alumno vino. La marca se ve al instante en todo lo que está en
 * caché —las agendas (Día, Semana, Mes y el detalle salen de ellas) y las clases
 * anteriores de los grupos— mientras Core la guarda; si Core la rechaza, vuelve
 * la que había y un `Alert` dice por qué (traducido por su `type`: la clase aún
 * no ha empezado, ya pasó el margen…). Al terminar, bien o mal, todo se vuelve
 * a pedir.
 */
export function useMarkAttendance(service: Pick<IScheduleService, "markAttendance"> = scheduleService) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ target, status }: MarkAttendance) => service.markAttendance(target, status),
    onMutate: async ({ target, status }) => {
      // Que una petición en vuelo no pise la marca recién puesta.
      await queryClient.cancelQueries({ queryKey: scheduleKeys.all });
      const before = queryClient.getQueriesData({ queryKey: scheduleKeys.all });
      // Cada forma con lo suyo: la agenda entera o una sola clase.
      queryClient.setQueriesData<ScheduleResponse>({ queryKey: scheduleKeys.agendas }, (data) =>
        data ? withAttendance(data, target, status) : data,
      );
      queryClient.setQueriesData<ScheduleClass | null>({ queryKey: scheduleKeys.previousClasses }, (data) =>
        data ? withStudentMark(data, target, status) : data,
      );
      return { before };
    },
    onError: (error, _vars, context) => {
      for (const [key, data] of context?.before ?? []) queryClient.setQueryData(key, data);
      alertError(error);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
}
