import { useMemo } from "react";

import type { ScheduleReader } from "@/shared/services/scheduleService";

import { useTeacherGroups } from "./useTeacherGroups";

/**
 * Un grupo para su detalle, de la misma agenda que «Mis grupos»
 * (`useTeacherGroups`): al venir de la lista se abre al instante, sin pedir
 * nada. `group` es `null` si ya no está (no le quedan clases, o se lo han
 * quitado): la pantalla dice «Grupo no encontrado».
 */
export function useGroupDetail(dbId: number, groupId: number, service?: ScheduleReader) {
  const { groups, hasData, error, refetch } = useTeacherGroups(service);
  const group = useMemo(
    () => groups.find(({ next }) => next.db_id === dbId && next.group_id === groupId) ?? null,
    [groups, dbId, groupId],
  );
  return { group, hasData, error, refetch };
}
