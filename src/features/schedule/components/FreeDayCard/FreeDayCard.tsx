import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./FreeDayCard.styles";

/** Un día sin clases: «Día libre · sin compromisos», como en la vista Semana del prototipo. */
export function FreeDayCard() {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container} testID="free-day">
      <Text variant="small" color="textSecondary" align="center">
        {t("schedule.day.free")}
      </Text>
    </View>
  );
}
