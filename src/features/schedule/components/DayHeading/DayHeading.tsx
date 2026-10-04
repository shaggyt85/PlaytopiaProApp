import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWallTime } from "@/shared/utils/formatDate";

import { DAY_HEADING_TITLE, useStyles, type DayHeadingSize } from "./DayHeading.styles";

interface DayHeadingProps {
  /** Ya compuesto: «Miércoles 18» o «Miércoles 18 de noviembre». */
  title: string;
  /** Cuántas clases tiene el día: «3 clases». */
  count: number;
  /** «Ahora» como hora de pared, solo si el día es hoy: la pastilla «HOY · 23:10». */
  nowWall?: number;
  size: DayHeadingSize;
  /** El día activo del Mes, resaltado. */
  active?: boolean;
  testID?: string;
}

/**
 * La cabecera de un día: su nombre, «HOY · 23:10» si es hoy y cuántas clases
 * tiene. La misma en la tarjeta de cada día de la Semana y en la franja de cada
 * día del Mes, con el tamaño de cada sitio en un mapa.
 */
export function DayHeading({ title, count, nowWall, size, active = false, testID }: DayHeadingProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={[styles.row, styles[size], active && styles.active]} testID={testID}>
      <View style={styles.title}>
        <Text variant={DAY_HEADING_TITLE[size]} numberOfLines={1} style={styles.titleText}>
          {title}
        </Text>
        {nowWall !== undefined ? (
          <Chip label={t("schedule.week.todayNow", { time: formatWallTime(nowWall) })} dot={false} />
        ) : null}
      </View>
      <Text variant="tab" color="textSecondary">
        {t("schedule.day.classes", { count })}
      </Text>
    </View>
  );
}
