import type { ColorPair } from "@/shared/config/theme";
import type { ClubOf } from "@/shared/hooks/useScheduleClubs";
import { sedeKey } from "@/shared/utils/sedeKey";

import type { HoursMonth, HoursTally, ProfileClub, TeacherHours } from "../schemas/profileDetails.schema";

// Las horas de Perfil son el avance del mes: lo hecho de lo planificado. Cada
// barra se llena con lo hecho sobre lo planificado de su fila (un mes pasado,
// llena; el actual, según avanza). Las cuentas, aquí; las tarjetas solo pintan.

/** El mes en curso: Core manda los meses del más reciente al más antiguo. */
export const currentMonth = (hours: TeacherHours): HoursMonth | undefined => hours.months[0];

/** Lo hecho sobre lo planificado, de 0 a 1; sin nada planificado, vacía (sin dividir entre cero). */
export const progress = ({ done_minutes, planned_minutes }: Pick<HoursTally, "done_minutes" | "planned_minutes">) =>
  planned_minutes > 0 ? Math.min(1, done_minutes / planned_minutes) : 0;

/** Las horas de una sede en un mes. */
export interface ClubHours {
  key: string;
  /** El nombre de la agenda o, si la sede ya no está en «Mis clubes», el de Core. */
  label: string;
  colors: ColorPair;
  doneMinutes: number;
  plannedMinutes: number;
  /** Lo hecho de lo planificado, de 0 a 1: el largo de su barra. */
  share: number;
}

/**
 * Cada sede de un mes con sus minutos hechos y planificados, en el orden que da
 * Core, con el nombre y el color que tiene en la agenda. El mismo cálculo para
 * el mes en curso y para cada mes del historial.
 */
export function clubBreakdown(month: HoursMonth, clubs: readonly ProfileClub[], clubOf: ClubOf): ClubHours[] {
  return month.clubs.map((tally) => {
    const club = clubOf(tally);
    const fromCore = clubs.find((c) => c.db_id === tally.db_id && c.club_id === tally.club_id);
    return {
      key: sedeKey(tally),
      label: club.label || (fromCore?.club_name ?? fromCore?.school_name ?? ""),
      colors: club.colors,
      doneMinutes: tally.done_minutes,
      plannedMinutes: tally.planned_minutes,
      share: progress(tally),
    };
  });
}

/** Un mes del historial. */
export interface MonthBar {
  /** `"2026-10"`. */
  month: string;
  doneMinutes: number;
  plannedMinutes: number;
  doneClasses: number;
  plannedClasses: number;
  /** Lo hecho de lo planificado, de 0 a 1: el largo de su barra. */
  share: number;
  /** El mes en curso, resaltado. */
  current: boolean;
}

/**
 * Los meses del historial, del actual hacia atrás, cada uno con su avance. Solo
 * los que tuvieron algo planificado: Core los manda todos, pero una fila con
 * «0:00 / 0:00 h» no dice nada (no trabajó ese mes).
 */
export function historyBars(months: readonly HoursMonth[]): MonthBar[] {
  return months
    .map(({ month, total }, index) => ({
      month,
      doneMinutes: total.done_minutes,
      plannedMinutes: total.planned_minutes,
      doneClasses: total.done_classes,
      plannedClasses: total.planned_classes,
      share: progress(total),
      current: index === 0,
    }))
    .filter((bar) => bar.plannedMinutes > 0);
}

/**
 * Lo que se ve al abrir un mes, además de sus clases: sus sedes, solo si fueron
 * dos o más. Con una, sus horas son las del mes, que ya están en su fila.
 */
export function monthClubsDetail(clubs: readonly ClubHours[]): ClubHours[] {
  const worked = clubs.filter((club) => club.plannedMinutes > 0);
  return worked.length > 1 ? worked : [];
}
