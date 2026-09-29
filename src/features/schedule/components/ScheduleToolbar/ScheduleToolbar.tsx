import { IconLoChevronLeft, IconLoChevronRight } from "@playtopia/icons/react-native";
import { useMemo } from "react";
import { View } from "react-native";

import { IconButton } from "@/shared/components/IconButton";
import { SegmentedTabs } from "@/shared/components/SegmentedTabs";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useAnnounceOnChange } from "../../hooks/useAnnounceOnChange";
import {
  announceLabel,
  SCHEDULE_VIEW_CONFIG,
  SCHEDULE_VIEWS,
  toolbarLabel,
  type ScheduleView,
} from "../../utils/scheduleViews";

import { useStyles } from "./ScheduleToolbar.styles";

/** Las flechas del prototipo (`h-10 w-10`). */
const ARROW_SIZE = 40;

interface ScheduleToolbarProps {
  view: ScheduleView;
  /** El día que se ve, `YYYY-MM-DD`. */
  date: string;
  isToday: boolean;
  /** «Ahora» como hora de pared (`wallNow`). */
  nowWall: number;
  onPrevious: () => void;
  onNext: () => void;
  /** Sin él no hay selector de vistas (mientras solo existe la vista Día). */
  onViewChange?: (view: ScheduleView) => void;
}

/**
 * Encima de la agenda: ‹ y › (un día, una semana o un mes, según la vista), el
 * texto de lo que se ve y, a la derecha, el selector DÍA · SEMANA · MES. Es el
 * único sitio que anuncia al lector de pantalla a dónde se ha llegado: al pulsar
 * una flecha o al cambiar de vista, sin la hora.
 */
export function ScheduleToolbar({
  view,
  date,
  isToday,
  nowWall,
  onPrevious,
  onNext,
  onViewChange,
}: ScheduleToolbarProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const config = SCHEDULE_VIEW_CONFIG[view];
  useAnnounceOnChange(announceLabel(view, date, isToday, t));

  // Por idioma: el reloj de la pantalla no vuelve a crear las opciones cada minuto.
  const options = useMemo(() => SCHEDULE_VIEWS.map(({ key, label }) => ({ key, label: t(label) })), [t]);

  return (
    <View style={styles.container}>
      <IconButton
        Icon={IconLoChevronLeft}
        size={ARROW_SIZE}
        accessibilityLabel={t(config.previous)}
        onPress={onPrevious}
      />
      <IconButton Icon={IconLoChevronRight} size={ARROW_SIZE} accessibilityLabel={t(config.next)} onPress={onNext} />
      <Text variant="meta" color="textSecondary" numberOfLines={1} style={styles.label}>
        {toolbarLabel(view, date, nowWall, t)}
      </Text>
      {onViewChange ? (
        <SegmentedTabs
          options={options}
          value={view}
          onChange={onViewChange}
          variant="compact"
          testID="schedule-views"
        />
      ) : null}
    </View>
  );
}
