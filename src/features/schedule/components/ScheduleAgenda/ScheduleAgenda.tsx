import { useState, type ComponentType } from "react";
import { View } from "react-native";

import type { ClubOf, LegendClub } from "../../hooks/useScheduleClubs";
import { useSelectedDay } from "../../hooks/useSelectedDay";
import { wallNow } from "../../utils/scheduleDates";
import { SCHEDULE_VIEWS, type ScheduleView, type ScheduleViewProps } from "../../utils/scheduleViews";
import { ClubLegend } from "../ClubLegend";
import { DaySchedule } from "../DaySchedule";
import { MonthSchedule } from "../MonthSchedule";
import { ScheduleToolbar } from "../ScheduleToolbar";
import { WeekSchedule } from "../WeekSchedule";

import { useStyles } from "./ScheduleAgenda.styles";

/**
 * Qué pinta cada vista, en un mapa y no en un `switch`: una vista nueva es una
 * línea aquí y su ficha en `SCHEDULE_VIEW_CONFIG`; `satisfies` obliga a que estén
 * todas. Las tres reciben las mismas props.
 */
const VIEW_COMPONENTS = {
  day: DaySchedule,
  week: WeekSchedule,
  month: MonthSchedule,
} satisfies Record<ScheduleView, ComponentType<ScheduleViewProps>>;

interface ScheduleAgendaProps {
  /** El reloj de la pantalla (`useForegroundNow` cada minuto). */
  now: number;
  today: string;
  /** La próxima clase (`useNextClass`), la misma de su tarjeta. */
  nextClassId: number | undefined;
  /** Los clubes de «Mis clubes» para la leyenda, y el de cada clase. */
  clubs: readonly LegendClub[];
  clubOf: ClubOf;
}

/**
 * La agenda debajo de la cabecera, como la captura: la barra (‹ ›, lo que se ve
 * y el selector DÍA · SEMANA · MES), la leyenda «CLUBES» y la vista elegida.
 *
 * Lleva lo que comparten las tres vistas: la vista (empieza en Día cada vez que
 * se abre la app), un solo día elegido para las tres (`useSelectedDay`) y «ahora»
 * como hora de pared, calculada una vez. Solo se monta la vista que se ve: las
 * tres leen la misma respuesta del mes, así que cambiar de vista no pide nada, y
 * el reloj no repinta lo que no se ve.
 */
export function ScheduleAgenda({ now, today, nextClassId, clubs, clubOf }: ScheduleAgendaProps) {
  const styles = useStyles();
  const [view, setView] = useState<ScheduleView>(SCHEDULE_VIEWS[0].key);
  const { date, isToday, goPrevious, goNext, select } = useSelectedDay(today);
  const nowWall = wallNow(now);
  const Content = VIEW_COMPONENTS[view];

  return (
    <View style={styles.container}>
      <ScheduleToolbar
        view={view}
        date={date}
        isToday={isToday}
        nowWall={nowWall}
        onPrevious={() => goPrevious(view)}
        onNext={() => goNext(view)}
        onViewChange={setView}
      />
      <ClubLegend clubs={clubs} />
      {/* `select` es estable: los días de la tira y del mes no se repintan con el reloj. */}
      <Content
        now={now}
        nowWall={nowWall}
        date={date}
        today={today}
        nextClassId={nextClassId}
        clubOf={clubOf}
        onSelect={select}
      />
    </View>
  );
}
