import { useMutation, useQueryClient } from "@tanstack/react-query";

import { session } from "@/shared/services/session";
import {
  teacherProfileQuery,
  teacherProfileService,
  type ITeacherProfileService,
} from "@/shared/services/teacherProfileService";
import type { SessionTokens } from "@/shared/services/tokenRefresh";
import { decodeSessionClaims } from "@/shared/utils/jwt";

import { TERMS_VERSION } from "../schemas/signUp.schema";

/**
 * Acepta la versión vigente de los términos (Core sella la fecha) y abre la
 * sesión con los tokens con los que se entró. El profesor sale del token. El
 * perfil que devuelve Core queda en la caché para el inicio.
 */
export function useAcceptTerms(profile: Pick<ITeacherProfileService, "update"> = teacherProfileService) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tokens: SessionTokens) => {
      const teacherId = decodeSessionClaims(tokens.access_token)?.userId;
      if (teacherId === undefined) throw new Error("El access token no dice qué profesor es.");
      const updated = await profile.update(teacherId, { terms_version: TERMS_VERSION });
      queryClient.setQueryData(teacherProfileQuery(teacherId).queryKey, updated);
      await session.start(tokens.access_token, tokens.refresh_token);
    },
  });
}
