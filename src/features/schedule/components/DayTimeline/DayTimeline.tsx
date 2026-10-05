import { useMemo } from "react";
import { View } from "react-native";

import type { ScheduleClub } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { colorAt } from "@/shared/utils/colorAt";

import { useScheduleHours } from "../../hooks/useScheduleHours";
import { classMinutes, classStatus } from "../../utils/classTiming";
import { classColors } from "../../utils/classColors";
import { layoutDay, type Stacked } from "../../utils/dayLayout";
import { visibleHours } from "../../utils/hourSpan";
import { localMinutes, wallNow } from "../../utils/scheduleDates";
import { nowOffset, timelineScale, type BlockGeometry } from "../../utils/timelineGeometry";
import { BLOCK_MIN_HEIGHT, HOUR_HEIGHT } from "../../utils/timelineMetrics";
import { HourGrid } from "../HourGrid";
import { NowLine } from "../NowLine";
import { ScheduleClassBlock } from "../ScheduleClassBlock";

import { useStyles } from "./DayTimeline.styles";

interface DayTimelineProps {
  /** Las clases del día que se ve. */
  classes: readonly ScheduleClass[];
  isToday: boolean;
  /** El reloj de la pantalla (`useForegroundNow` cada minuto). */
  now: number;
  /** La próxima clase según Core (`next_class`), para su marca. */
  nextClassId: number | undefined;
  clubOf: (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
}

/** Dónde va una tarjeta: el inicio de su grupo en la escala y su sitio dentro de él. */
function geometryOf(
  stacked: Stacked | undefined,
  start: number,
  yOf: (minutes: number) => number,
): BlockGeometry {
  // Toda clase de la lista está en el reparto; si no, en su hora con el alto mínimo.
  if (!stacked) return { top: yOf(start), height: BLOCK_MIN_HEIGHT };
  return { top: yOf(stacked.groupStart) + stacked.top, height: stacked.height };
}

/**
 * La tira de horas de un día, como el prototipo: el eje (la línea con sus
 * horas y el punto de inicio de cada clase), las clases (las que coinciden, una
 * debajo de otra en su tramo estirado: `layoutDay`) y la línea de «ahora» si
 * es hoy. Todo con la misma escala (`timelineScale`). Sin panel: va sobre el
 * fondo de marca. La franja es la configurada, ampliada si alguna clase se sale.
 *
 * La posición de cada tarjeta solo cambia con las clases; lo que cambia cada
 * minuto es su estado y la línea, y las tarjetas con `memo` solo se vuelven a
 * pintar si su estado cambia.
 */
export function DayTimeline({ classes, isToday, now, nextClassId, clubOf }: DayTimelineProps) {
  const styles = useStyles();
  const configured = useScheduleHours();
  const theme = useTheme();

  const { span, scale, blocks, starts } = useMemo(() => {
    const timed = classes.map((item) => ({ item, minutes: classMinutes(item) }));
    const hours = visibleHours(
      configured,
      timed.map((c) => c.minutes),
    );
    const layout = layoutDay(
      timed.map(({ item, minutes }) => ({ id: item.id, ...minutes })),
      HOUR_HEIGHT,
      BLOCK_MIN_HEIGHT,
    );
    const dayScale = timelineScale(hours, HOUR_HEIGHT, layout.stretches);
    // Cada clase con su color en el día (el mismo que en Semana y en la tira).
    const colorOf = classColors(classes, theme.clubColors);
    const colorsOf = (id: number) => colorOf.get(id) ?? colorAt(theme.clubColors, 0);
    return {
      span: hours,
      scale: dayScale,
      starts: timed.map(({ item, minutes }) => ({
        id: item.id,
        time: item.class_time,
        minutes: minutes.start,
        color: colorsOf(item.id).color,
        next: item.id === nextClassId,
      })),
      blocks: timed.map(({ item, minutes }) => ({
        item,
        colors: colorsOf(item.id),
        geometry: geometryOf(layout.blocks.get(item.id), minutes.start, dayScale.yOf),
      })),
    };
  }, [classes, configured, nextClassId, theme.clubColors]);

  const nowWall = wallNow(now);
  const nowTop = isToday ? nowOffset(localMinutes(now), span, scale) : null;

  return (
    <View style={styles.container} testID="day-timeline">
      <View style={[styles.track, { height: scale.height }]}>
        <HourGrid span={span} yOf={scale.yOf} starts={starts} />
        <View style={styles.blocks}>
          {blocks.map(({ item, colors, geometry }) => (
            <ScheduleClassBlock
              key={item.id}
              item={item}
              colors={colors}
              club={clubOf(item)}
              status={classStatus(item, nowWall, nextClassId)}
              geometry={geometry}
            />
          ))}
        </View>
        {nowTop === null ? null : <NowLine top={nowTop} wallMs={nowWall} />}
      </View>
    </View>
  );
}
