import { View } from "react-native";

import { PressableScale } from "@/shared/components/PressableScale";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { courtTimeProgressLabel } from "@/shared/utils/courtTime";
import { formatMonthName } from "@/shared/utils/formatDate";

import type { ClubHours, MonthBar } from "../../utils/monthHours";
import { ExpandChevron } from "../ExpandChevron";
import { HoursProgressRow } from "../HoursProgressRow";

import { useStyles } from "./HoursMonthRow.styles";

interface HoursMonthRowProps {
  bar: MonthBar;
  /** Sus sedes con sus horas, si fueron dos o más: lo que se ve al abrirlo además de sus clases. */
  clubs: readonly ClubHours[];
  open: boolean;
  onToggle: (month: string) => void;
}

/**
 * Un mes del historial de horas: la misma fila de horas que una sede
 * (`HoursProgressRow`), con su nombre (el actual en magenta) y la › que se abre.
 * Al tocarlo, sus clases («8 de 11 clases») y, si trabajó en varias sedes, cada
 * una con lo suyo: con una, sus horas son las de la fila y no se repiten.
 */
export function HoursMonthRow({ bar, clubs, open, onToggle }: HoursMonthRowProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const name = formatMonthName(bar.month);
  return (
    <View>
      <PressableScale
        onPress={() => onToggle(bar.month)}
        accessibilityLabel={t("profile.hours.monthA11y", {
          month: name,
          hours: courtTimeProgressLabel(bar.doneMinutes, bar.plannedMinutes, t),
        })}
        expanded={open}
        style={styles.row}
      >
        <HoursProgressRow
          label={name}
          labelColor={bar.current ? "primary" : "text"}
          trailing={<ExpandChevron expanded={open} />}
          doneMinutes={bar.doneMinutes}
          plannedMinutes={bar.plannedMinutes}
          share={bar.share}
          testID={`hours-month-${bar.month}`}
        />
      </PressableScale>
      {open ? (
        <View style={styles.detail} testID={`hours-month-${bar.month}-detail`}>
          <Text variant="segment" color="textSecondary">
            {t("profile.hours.monthClasses", { done: bar.doneClasses, count: bar.plannedClasses })}
          </Text>
          {clubs.map((club) => (
            <View key={club.key} style={styles.club}>
              <Text variant="labelStrong" color="textSecondary" numberOfLines={1} style={styles.clubName}>
                {club.label}
              </Text>
              <Text variant="labelStrong" numberOfLines={1}>
                {courtTimeProgressLabel(club.doneMinutes, club.plannedMinutes, t)}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
}
