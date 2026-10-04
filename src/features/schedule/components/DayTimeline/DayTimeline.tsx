import { useMemo } from "react";
import { View } from "react-native";

import { useTheme } from "@/shared/hooks/useTheme";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import { useScheduleHours } from "../../hooks/useScheduleHours";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { classMinutes, classStatus } from "../../utils/classTiming";
import { colorAt } from "../../utils/colorAt";
import { layoutDay } from "../../utils/dayLayout";
import { visibleHours } from "../../utils/hourSpan";
import { localMinutes, wallNow } from "../../utils/scheduleDates";
import { blockGeometry, nowOffset } from "../../utils/timelineGeometry";
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

/**
 * La tira de horas de un día, como el prototipo: el eje (la línea con sus
 * horas y el punto de inicio de cada clase), las clases, lado a lado si
 * coinciden, y la línea de «ahora» si es hoy. Sin panel: va sobre el fondo de
 * marca. La franja es la configurada, ampliada si alguna clase se sale.
 *
 * La posición de cada tarjeta solo cambia con las clases; lo que cambia cada
 * minuto es su estado y la línea, y las tarjetas con `memo` solo se vuelven a
 * pintar si su estado cambia.
 */
export function DayTimeline({ classes, isToday, now, nextClassId, clubOf }: DayTimelineProps) {
  const styles = useStyles();
  const configured = useScheduleHours();
  const theme = useTheme();

  const { span, blocks, starts } = useMemo(() => {
    const timed = classes.map((item) => ({ item, minutes: classMinutes(item) }));
    const hours = visibleHours(
      configured,
      timed.map((c) => c.minutes),
    );
    const placements = layoutDay(timed.map(({ item, minutes }) => ({ id: item.id, ...minutes })));
    // Cada clase con su color, por su orden en el día y en ciclo, como el prototipo
    // (que da vida a la agenda): fijo, no al azar, para que no cambie al repintar.
    const ordered = [...timed].sort((a, b) => a.minutes.start - b.minutes.start || a.item.id - b.item.id);
    const colorOf = new Map(ordered.map(({ item }, index) => [item.id, colorAt(theme.clubColors, index)]));
    const colorsOf = (id: number) => colorOf.get(id) ?? colorAt(theme.clubColors, 0);
    return {
      span: hours,
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
        geometry: blockGeometry(minutes, hours, HOUR_HEIGHT, BLOCK_MIN_HEIGHT),
        // Toda clase de la lista está en el reparto.
        placement: placements.get(item.id) ?? { column: 0, columns: 1 },
      })),
    };
  }, [classes, configured, nextClassId, theme.clubColors]);

  const nowWall = wallNow(now);
  const nowTop = isToday ? nowOffset(localMinutes(now), span, HOUR_HEIGHT) : null;

  return (
    <View style={styles.container} testID="day-timeline">
      <View style={[styles.track, { height: (span.end - span.start) * HOUR_HEIGHT }]}>
        <HourGrid span={span} hourHeight={HOUR_HEIGHT} starts={starts} />
        <View style={styles.blocks}>
          {blocks.map(({ item, colors, geometry, placement }) => (
            <ScheduleClassBlock
              key={item.id}
              item={item}
              colors={colors}
              club={clubOf(item)}
              status={classStatus(item, nowWall, nextClassId)}
              geometry={geometry}
              placement={placement}
            />
          ))}
        </View>
        {nowTop === null ? null : <NowLine top={nowTop} wallMs={nowWall} />}
      </View>
    </View>
  );
}
