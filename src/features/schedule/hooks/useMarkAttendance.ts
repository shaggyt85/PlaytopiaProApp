import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Alert } from "react-native";

import { getErrorMessage } from "@/shared/utils/getErrorMessage";

import type { AttendanceStatus, ScheduleResponse } from "../schemas/schedule.schema";
import {
  scheduleKeys,
  scheduleService,
  type AttendanceTarget,
  type IScheduleService,
} from "../services/scheduleService";
import { withAttendance } from "../utils/withAttendance";

interface MarkAttendance {
  target: AttendanceTarget;
  status: AttendanceStatus;
}

/**
 * Marca si un alumno vino. La marca se ve al instante en todas las agendas en
 * caché (Día, Semana, Mes y el detalle salen de ellas) mientras Core la guarda;
 * si Core la rechaza, vuelve la que había y un `Alert` dice por qué (traducido
 * por su `type`: la clase aún no ha empezado, ya pasó el margen…). Al terminar,
 * bien o mal, la agenda se vuelve a pedir.
 */
export function useMarkAttendance(service: Pick<IScheduleService, "markAttendance"> = scheduleService) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ target, status }: MarkAttendance) => service.markAttendance(target, status),
    onMutate: async ({ target, status }) => {
      // Que una petición en vuelo no pise la marca recién puesta.
      await queryClient.cancelQueries({ queryKey: scheduleKeys.all });
      const before = queryClient.getQueriesData<ScheduleResponse>({ queryKey: scheduleKeys.all });
      queryClient.setQueriesData<ScheduleResponse>({ queryKey: scheduleKeys.all }, (data) =>
        data ? withAttendance(data, target, status) : data,
      );
      return { before };
    },
    onError: (error, _vars, context) => {
      for (const [key, data] of context?.before ?? []) queryClient.setQueryData(key, data);
      Alert.alert(getErrorMessage(error));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: scheduleKeys.all }),
  });
}
