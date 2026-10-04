import { IconLoChevronLeft, IconLoChevronRight } from "@playtopia/icons/react-native";
import { useMemo } from "react";
import { Pressable, View } from "react-native";

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

import { ARROW_SIZE, useStyles } from "./ScheduleToolbar.styles";

interface ScheduleToolbarProps {
  view: ScheduleView;
  /** El día que se ve, `YYYY-MM-DD`. */
  date: string;
  isToday: boolean;
  onPrevious: () => void;
  onNext: () => void;
  /** Tocar el texto del centro vuelve a hoy. */
  onToday: () => void;
  onViewChange: (view: ScheduleView) => void;
}

/**
 * La navegación de la agenda, como el prototipo: ‹ «Hoy» › centrado (las flechas
 * avanzan un día, una semana o un mes según la vista; tocar el texto vuelve a
 * hoy) y debajo las pestañas Día · Semana · Mes subrayadas. Es el único sitio
 * que anuncia al lector de pantalla a dónde se ha llegado: al pulsar una flecha
 * o al cambiar de vista.
 */
export function ScheduleToolbar({
  view,
  date,
  isToday,
  onPrevious,
  onNext,
  onToday,
  onViewChange,
}: ScheduleToolbarProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const config = SCHEDULE_VIEW_CONFIG[view];
  const label = toolbarLabel(view, date, isToday, t);
  useAnnounceOnChange(announceLabel(view, date, isToday, t));

  // Por idioma: el reloj de la pantalla no vuelve a crear las opciones cada minuto.
  const options = useMemo(() => SCHEDULE_VIEWS.map((item) => ({ key: item.key, label: t(item.label) })), [t]);

  return (
    <View>
      <View style={styles.nav}>
        <IconButton
          Icon={IconLoChevronLeft}
          size={ARROW_SIZE}
          variant="plain"
          accessibilityLabel={t(config.previous)}
          onPress={onPrevious}
        />
        <Pressable
          onPress={onToday}
          accessibilityRole="button"
          accessibilityLabel={label}
          accessibilityHint={t("schedule.toolbar.goToday")}
          style={({ pressed }) => [styles.current, pressed && styles.pressed]}
          testID="schedule-today"
        >
          <Text variant="subtitle" align="center" numberOfLines={1}>
            {label}
          </Text>
        </Pressable>
        <IconButton
          Icon={IconLoChevronRight}
          size={ARROW_SIZE}
          variant="plain"
          accessibilityLabel={t(config.next)}
          onPress={onNext}
        />
      </View>
      <View style={styles.tabs}>
        <SegmentedTabs options={options} value={view} onChange={onViewChange} variant="underline" testID="schedule-views" />
      </View>
    </View>
  );
}
