import { useQuery } from "@tanstack/react-query";

import { useSessionUserId } from "@/shared/store/sessionStore";

import { myClubsQuery, networkService, type INetworkService } from "../services/networkService";

/**
 * Las sedes donde trabaja el profesor con la sesión abierta. Se pide al abrir
 * «Red de clubes» y sale de la caché mientras esté fresca (`STANDARD`).
 */
export function useMyClubs(service: Pick<INetworkService, "getMyClubs"> = networkService) {
  const teacherId = useSessionUserId();
  return useQuery(myClubsQuery(teacherId, service));
}
