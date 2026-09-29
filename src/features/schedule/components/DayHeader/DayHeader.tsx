import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

import { useStyles } from "./DayHeader.styles";

interface DayHeaderProps {
  /** El día que se ve, `YYYY-MM-DD`. */
  date: string;
  isToday: boolean;
  classCount: number;
}

/** Encima de la tira: la pastilla del día («● HOY · LUNES 5») y cuántas clases tiene. */
export function DayHeader({ date, isToday, classCount }: DayHeaderProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const day = formatWeekdayDay(date);

  return (
    <View style={styles.container}>
      <Chip label={isToday ? t("schedule.day.today", { day }) : day} />
      <Text variant="meta" color="textSecondary">
        {t("schedule.day.classes", { count: classCount })}
      </Text>
    </View>
  );
}
