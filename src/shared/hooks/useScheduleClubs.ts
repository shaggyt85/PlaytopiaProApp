import { useCallback, useMemo } from "react";

import type { ColorPair } from "@/shared/config/theme";
import { useMyClubs } from "@/shared/hooks/useMyClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { myClubsService, type IMyClubsService } from "@/shared/services/myClubsService";
import { colorAt } from "@/shared/utils/colorAt";
import { sedeKey } from "@/shared/utils/sedeKey";

/** Lo que la agenda enseña del club de una clase. */
export interface ScheduleClub {
  /** El nombre de la sede o, si no tiene uno propio, el de la escuela. */
  label: string;
  colors: ColorPair;
}

/** Una sede de «Mis clubes» con lo que se enseña de ella: la lista de Perfil. */
export interface MyClub extends ScheduleClub {
  /** `sedeKey`: la clave de la fila. */
  key: string;
}

/** El club de una clase por su sede (`useScheduleClubs().clubOf`). */
export type ClubOf = (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;

/**
 * Los clubes de la agenda, a partir de «Mis clubes» (misma caché que «Red de
 * clubes»): `clubOf` da el club de cada clase, con su nombre corto y su color,
 * fijo por su posición; `clubs`, la lista con lo mismo (la tarjeta de clubes de
 * Perfil). Todo sale del mismo cálculo, así las tarjetas, el detalle y Perfil
 * nunca dan colores ni nombres distintos.
 *
 * Una sede que no esté en «Mis clubes» —le acaban de dar de baja y la caché aún
 * no lo sabe— sale sin nombre y con el color neutro: la clase se ve igual.
 */
export function useScheduleClubs(service: IMyClubsService = myClubsService) {
  const theme = useTheme();
  const { data, error, refetch } = useMyClubs(service);

  // Un solo cálculo del nombre y el color de cada sede: la lista y `clubOf` salen de él.
  const clubs = useMemo<readonly MyClub[]>(
    () =>
      (data?.clubs ?? []).map((club, index) => ({
        key: sedeKey(club),
        label: club.club_name ?? club.name,
        colors: colorAt(theme.clubColors, index),
      })),
    [data, theme.clubColors],
  );
  const byKey = useMemo(() => new Map<string, ScheduleClub>(clubs.map((club) => [club.key, club])), [clubs]);

  const clubOf = useCallback<ClubOf>(
    (sede): ScheduleClub =>
      byKey.get(sedeKey(sede)) ?? { label: "", colors: theme.clubColorUnknown },
    [byKey, theme.clubColorUnknown],
  );

  return { clubOf, clubs, hasData: data !== undefined, error, refetch };
}
