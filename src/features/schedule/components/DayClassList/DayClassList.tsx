import { memo, useMemo, type ComponentType } from "react";
import { View } from "react-native";

import type { ColorPair } from "@/shared/config/theme";
import type { ScheduleClub } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import type { ScheduleClass } from "@/shared/schemas/schedule.schema";
import type { SchoolCard } from "@/shared/schemas/schoolCard.schema";
import { colorAt } from "@/shared/utils/colorAt";

import { classColors } from "../../utils/classColors";
import { statusOnDay, type ClassStatus } from "../../utils/classTiming";
import type { DayTense } from "../../utils/scheduleDates";
import { FreeDayCard } from "../FreeDayCard";

import { useStyles } from "./DayClassList.styles";

/** Lo que recibe la fila que pinta cada clase (la de Semana o la de Mes). */
export interface DayClassRowProps {
  item: ScheduleClass;
  /** Su color en el día (`classColors`): el mismo que en la vista Día. */
  colors: ColorPair;
  club: ScheduleClub;
  status: ClassStatus;
}

interface DayClassListProps {
  classes: readonly ScheduleClass[];
  tense: DayTense;
  /** «Ahora» como hora de pared, solo si el día es hoy: los demás no la necesitan. */
  nowWall?: number;
  /** La próxima según Core: hoy se marca, como el prototipo. */
  nextClassId?: number;
  clubOf: (branch: Pick<SchoolCard, "db_id" | "club_id">) => ScheduleClub;
  /** La fila de cada vista: `WeekClassRow` o `MonthClassRow`, como en su captura. */
  Row: ComponentType<DayClassRowProps>;
}

/**
 * Las clases de un día en Semana y en Mes: el estado de cada una (`statusOnDay`),
 * su color en el día, su club y la fila de la vista, o «Día libre» si no tiene.
 * Así ese cálculo se escribe una vez y cada vista solo elige su fila.
 */
export const DayClassList = memo(function DayClassList({
  classes,
  tense,
  nowWall,
  nextClassId,
  clubOf,
  Row,
}: DayClassListProps) {
  const styles = useStyles();
  const theme = useTheme();
  const colors = useMemo(() => classColors(classes, theme.clubColors), [classes, theme.clubColors]);
  if (classes.length === 0) return <FreeDayCard />;

  return (
    <View style={styles.rows}>
      {classes.map((item) => (
        <Row
          key={item.id}
          item={item}
          colors={colors.get(item.id) ?? colorAt(theme.clubColors, 0)}
          club={clubOf(item)}
          status={statusOnDay(item, tense, nowWall, nextClassId)}
        />
      ))}
    </View>
  );
});
