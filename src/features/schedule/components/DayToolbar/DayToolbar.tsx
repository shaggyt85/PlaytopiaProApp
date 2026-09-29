import { IconLoChevronLeft, IconLoChevronRight } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { IconButton } from "@/shared/components/IconButton";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { toolbarLabel } from "../../utils/toolbarLabel";

import { useStyles } from "./DayToolbar.styles";

/** Las flechas del prototipo (`h-10 w-10`). */
const ARROW_SIZE = 40;

interface DayToolbarProps {
  /** El día que se ve, `YYYY-MM-DD`. */
  date: string;
  /** «Ahora» como hora de pared (`wallNow`). */
  nowWall: number;
  onPrevious: () => void;
  onNext: () => void;
}

/**
 * Encima de la tira: ‹ el día anterior, › el siguiente, y el día que se ve con
 * la hora de ahora («lunes 18 · 15:21»). El selector Día/Semana/Mes llega con la
 * vista Semana.
 */
export function DayToolbar({ date, nowWall, onPrevious, onNext }: DayToolbarProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <IconButton
        Icon={IconLoChevronLeft}
        size={ARROW_SIZE}
        accessibilityLabel={t("schedule.day.previousDay")}
        onPress={onPrevious}
      />
      <IconButton
        Icon={IconLoChevronRight}
        size={ARROW_SIZE}
        accessibilityLabel={t("schedule.day.nextDay")}
        onPress={onNext}
      />
      <Text variant="meta" color="textSecondary" numberOfLines={1} style={styles.label}>
        {toolbarLabel("day", date, nowWall, t)}
      </Text>
    </View>
  );
}
