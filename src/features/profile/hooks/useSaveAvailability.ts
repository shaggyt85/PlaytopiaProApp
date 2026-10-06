import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { useSessionUserId } from "@/shared/store/sessionStore";

import type { ProfileDetails } from "../schemas/profileDetails.schema";
import type { WeeklyHours } from "../schemas/weeklyHours.schema";
import { availabilityService, type IAvailabilityService } from "../services/availabilityService";
import { profileKeys } from "../services/profileDetailsService";
import { withClubWeek } from "../utils/withClubWeek";

/** Una sede y la semana a guardar en ella. */
export interface SaveAvailability {
  dbId: number;
  clubId: number;
  week: WeeklyHours;
}

/**
 * Guarda la semana de una sede. La que devuelve Core se deja en los detalles de
 * Perfil (`withClubWeek`): la tarjeta la enseña al instante, sin volver a
 * pedir nada.
 */
export function useSaveAvailability(service: IAvailabilityService = availabilityService) {
  const queryClient = useQueryClient();
  const teacherId = useSessionUserId();
  const { locale } = useTranslation();
  return useMutation({
    mutationFn: ({ dbId, clubId, week }: SaveAvailability) => service.replace(dbId, clubId, week),
    onSuccess: (saved) => {
      queryClient.setQueryData<ProfileDetails>(profileKeys.details(teacherId, locale), (details) =>
        withClubWeek(details, saved),
      );
    },
  });
}
