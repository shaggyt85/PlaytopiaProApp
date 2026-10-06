import type { ClubOf } from "@/shared/hooks/useScheduleClubs";

import type { ProfileClub } from "../schemas/profileDetails.schema";

/**
 * El nombre de una sede en Perfil: el de la agenda (`clubOf`) o, si ya no está
 * en «Mis clubes», el que manda Core (la sede o, sin nombre propio, la escuela).
 * Lo usan las horas, la disponibilidad y su editor.
 */
export const profileClubLabel = (club: ProfileClub, clubOf: ClubOf): string =>
  clubOf(club).label || (club.club_name ?? club.school_name);
