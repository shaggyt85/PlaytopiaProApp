import { useRouter } from "expo-router";
import { useCallback } from "react";

import { useOpenClass } from "@/shared/hooks/useOpenClass";

import { groupDetailHref } from "../utils/groupRoute";
import type { TeacherGroup } from "../utils/groupsFromSchedule";

/**
 * Abrir un grupo: su detalle. Una clase antigua sin grupo no tiene detalle de
 * grupo: abre la clase. Estable: las tarjetas no se repintan por ella.
 */
export function useOpenGroup() {
  const router = useRouter();
  const openClass = useOpenClass();
  return useCallback(
    ({ next }: TeacherGroup) =>
      next.group_id === null ? openClass(next) : router.push(groupDetailHref(next.db_id, next.group_id)),
    [router, openClass],
  );
}
