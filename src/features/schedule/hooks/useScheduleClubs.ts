import { useCallback, useMemo } from "react";

import type { ColorPair } from "@/shared/config/theme";
import { useMyClubs } from "@/shared/hooks/useMyClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { myClubsService, type IMyClubsService } from "@/shared/services/myClubsService";
import { sedeKey } from "@/shared/utils/sedeKey";

import { colorAt } from "../utils/colorAt";

/** Lo que la agenda enseña del club de una clase. */
export interface ScheduleClub {
  /** El nombre de la sede o, si no tiene uno propio, el de la escuela. */
  label: string;
  colors: ColorPair;
}

/**
 * El club de cada clase de la agenda, a partir de «Mis clubes» (misma caché que
 * «Red de clubes»): su nombre corto y su color, fijo por su posición.
 *
 * Una sede que no esté en «Mis clubes» —le acaban de dar de baja y la caché aún
 * no lo sabe— sale sin nombre y con el color neutro: la clase se ve igual.
 */
export function useScheduleClubs(service: IMyClubsService = myClubsService) {
  const theme = useTheme();
  const { data } = useMyClubs(service);

  const byKey = useMemo(
    () =>
      new Map<string, ScheduleClub>(
        (data?.clubs ?? []).map((club, index) => [
          sedeKey(club),
          { label: club.club_name ?? club.name, colors: colorAt(theme.clubColors, index) },
        ]),
      ),
    [data, theme.clubColors],
  );

  const clubOf = useCallback(
    (sede: Pick<SchoolCard, "db_id" | "club_id">): ScheduleClub =>
      byKey.get(sedeKey(sede)) ?? { label: "", colors: theme.clubColorUnknown },
    [byKey, theme.clubColorUnknown],
  );

  return { clubOf };
}
