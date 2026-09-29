import { Pressable, View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayDay } from "@/shared/utils/formatDate";

import { splitAround } from "../../utils/splitAround";

import { SHOW_ALL_HEIGHT, useStyles } from "./WeekFilter.styles";

interface WeekFilterProps {
  /** El día tocado en la tira. */
  date: string;
  onShowAll: () => void;
}

/**
 * Con un día tocado en la tira: «Filtrado por **martes 19**» y el botón «VER
 * TODA LA SEMANA», que vuelve a enseñar la semana.
 */
export function WeekFilter({ date, onShowAll }: WeekFilterProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const day = formatWeekdayDay(date);
  const [before, after] = splitAround((mark) => t("schedule.week.filteredBy", { day: mark }));

  return (
    <View style={styles.row}>
      <Text variant="meta" color="textSecondary" style={styles.text}>
        {before}
        <Text variant="metaStrong" color="text">
          {day}
        </Text>
        {after}
      </Text>
      <Pressable
        onPress={onShowAll}
        accessibilityRole="button"
        hitSlop={(theme.touchTarget - SHOW_ALL_HEIGHT) / 2}
        style={styles.showAll}
      >
        <Text variant="chip" color="primary">
          {t("schedule.week.showAll")}
        </Text>
      </Pressable>
    </View>
  );
}
