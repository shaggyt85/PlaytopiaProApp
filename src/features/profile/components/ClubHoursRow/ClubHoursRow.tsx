import { ClubDot } from "@/shared/components/ClubDot";

import type { ClubHours } from "../../utils/monthHours";
import { HoursProgressRow } from "../HoursProgressRow";

interface ClubHoursRowProps {
  club: ClubHours;
}

/**
 * Una sede en «Horas este mes»: su punto de color y su nombre (los de la
 * agenda) en la fila de horas de Perfil (`HoursProgressRow`).
 */
export function ClubHoursRow({ club }: ClubHoursRowProps) {
  return (
    <HoursProgressRow
      label={club.label}
      leading={<ClubDot color={club.colors.color} />}
      doneMinutes={club.doneMinutes}
      plannedMinutes={club.plannedMinutes}
      share={club.share}
      testID={`club-hours-${club.key}`}
    />
  );
}
