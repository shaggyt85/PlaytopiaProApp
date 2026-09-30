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

/** El club de una clase por su sede (`useScheduleClubs().clubOf`). */
export type ClubOf = (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;

/** Un club de «Mis clubes» en la leyenda: su sede (`sedeKey`), nombre y color. */
export interface LegendClub extends ScheduleClub {
  key: string;
}

/**
 * Los clubes de la agenda, a partir de «Mis clubes» (misma caché que «Red de
 * clubes»): la lista para la leyenda, `clubOf` para el club de cada clase, con
 * su nombre corto y su color, fijo por su posición, y `cardOf` para su tarjeta de
 * sede (la dirección, en el detalle). Todo sale del mismo cálculo, así la
 * leyenda, las tarjetas y el detalle nunca dan colores ni datos distintos.
 *
 * Una sede que no esté en «Mis clubes» —le acaban de dar de baja y la caché aún
 * no lo sabe— sale sin nombre y con el color neutro: la clase se ve igual.
 */
export function useScheduleClubs(service: IMyClubsService = myClubsService) {
  const theme = useTheme();
  const { data } = useMyClubs(service);

  const { clubs, byKey, cards } = useMemo(() => {
    const list: LegendClub[] = (data?.clubs ?? []).map((club, index) => ({
      key: sedeKey(club),
      label: club.club_name ?? club.name,
      colors: colorAt(theme.clubColors, index),
    }));
    return {
      clubs: list,
      byKey: new Map<string, ScheduleClub>(list.map((club) => [club.key, club])),
      cards: new Map<string, SchoolCard>((data?.clubs ?? []).map((card) => [sedeKey(card), card])),
    };
  }, [data, theme.clubColors]);

  const clubOf = useCallback<ClubOf>(
    (sede): ScheduleClub =>
      byKey.get(sedeKey(sede)) ?? { label: "", colors: theme.clubColorUnknown },
    [byKey, theme.clubColorUnknown],
  );

  /** La tarjeta de sede de un club de «Mis clubes»; `undefined` si ya no está. */
  const cardOf = useCallback(
    (sede: Pick<SchoolCard, "db_id" | "club_id">): SchoolCard | undefined => cards.get(sedeKey(sede)),
    [cards],
  );

  return { clubs, clubOf, cardOf };
}
