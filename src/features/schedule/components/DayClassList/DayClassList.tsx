import { memo, type ComponentType } from "react";
import { View } from "react-native";

import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";

import type { ScheduleClub } from "../../hooks/useScheduleClubs";
import type { ScheduleClass } from "../../schemas/schedule.schema";
import { statusOnDay, type ClassStatus } from "../../utils/classTiming";
import type { DayTense } from "../../utils/scheduleDates";
import { FreeDayCard } from "../FreeDayCard";

import { useStyles } from "./DayClassList.styles";

/** Lo que recibe la fila que pinta cada clase (la de Semana o la de Mes). */
export interface DayClassRowProps {
  item: ScheduleClass;
  club: ScheduleClub;
  status: ClassStatus;
}

interface DayClassListProps {
  classes: readonly ScheduleClass[];
  tense: DayTense;
  /** «Ahora» como hora de pared, solo si el día es hoy: los demás no la necesitan. */
  nowWall?: number;
  clubOf: (sede: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
  /** La fila de cada vista: \`WeekClassRow\` o \`MonthClassRow\`, como en su captura. */
  Row: ComponentType<DayClassRowProps>;
}

/**
 * Las clases de un día en Semana y en Mes: el estado de cada una (\`statusOnDay\`),
 * su club y la fila de la vista, o «Día libre» si no tiene. Así ese cálculo se
 * escribe una vez y cada vista solo elige su fila.
 */
export const DayClassList = memo(function DayClassList({ classes, tense, nowWall, clubOf, Row }: DayClassListProps) {
  const styles = useStyles();
  if (classes.length === 0) return <FreeDayCard />;

  return (
    <View style={styles.rows}>
      {classes.map((item) => (
        <Row key={item.id} item={item} club={clubOf(item)} status={statusOnDay(item, tense, nowWall)} />
      ))}
    </View>
  );
});
