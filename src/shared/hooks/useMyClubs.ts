import { useQuery } from "@tanstack/react-query";

import { myClubsQuery, myClubsService, type IMyClubsService } from "@/shared/services/myClubsService";
import { useSessionUserId } from "@/shared/store/sessionStore";

/**
 * Las sedes donde trabaja el profesor con la sesión abierta. Las piden «Red de
 * clubes» y la agenda, y comparten caché (`STANDARD`): una sola petición.
 */
export function useMyClubs(service: IMyClubsService = myClubsService) {
  const teacherId = useSessionUserId();
  return useQuery(myClubsQuery(teacherId, service));
}
