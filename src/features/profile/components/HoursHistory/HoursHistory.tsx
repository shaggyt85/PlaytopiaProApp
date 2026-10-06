import { IconLoHistory } from "@playtopia/icons/react-native";
import { useMemo, useState } from "react";
import { View } from "react-native";

import { PressableScale } from "@/shared/components/PressableScale";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import type { TeacherHours } from "../../schemas/profileDetails.schema";
import { clubBreakdown, historyBars, monthClubsDetail } from "../../utils/monthHours";
import { ExpandChevron } from "../ExpandChevron";
import { HoursMonthRow } from "../HoursMonthRow";

import { useStyles } from "./HoursHistory.styles";

/** El icono del botón (`h-4 w-4 text-gold`). */
const ICON_SIZE = 16;

interface HoursHistoryProps {
  hours: TeacherHours;
}

/**
 * «Historial de horas», como el prototipo: cerrado de entrada; abierto, un mes
 * por fila (`historyBars`, solo los trabajados) y, al tocar uno, sus clases y,
 * si fueron dos o más, sus sedes (`monthClubsDetail` sobre `clubBreakdown`, el
 * mismo cálculo que el mes en curso). Uno abierto a la vez. Sin ningún mes
 * trabajado, no sale. Que esté abierto es
 * estado de esta tarjeta y nada más.
 */
export function HoursHistory({ hours }: HoursHistoryProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { clubOf } = useScheduleClubs();
  const [open, setOpen] = useState(false);
  const [openMonth, setOpenMonth] = useState<string | null>(null);

  const months = useMemo(
    () =>
      historyBars(hours.months).map((bar) => {
        const month = hours.months.find((m) => m.month === bar.month);
        return { bar, clubs: month ? monthClubsDetail(clubBreakdown(month, hours.clubs, clubOf)) : [] };
      }),
    [hours, clubOf],
  );

  // Sin ningún mes trabajado, no hay historial que abrir.
  if (months.length === 0) return null;

  return (
    <View>
      <PressableScale
        onPress={() => setOpen((value) => !value)}
        accessibilityLabel={t("profile.hours.history")}
        expanded={open}
        style={styles.toggle}
        testID="hours-history-toggle"
      >
        <IconLoHistory size={ICON_SIZE} color={theme.accents.gold.color} />
        <Text variant="labelStrong" style={styles.label}>
          {t("profile.hours.history")}
        </Text>
        <ExpandChevron expanded={open} />
      </PressableScale>
      {open ? (
        <View style={styles.months} testID="hours-history">
          {months.map(({ bar, clubs }) => (
            <HoursMonthRow
              key={bar.month}
              bar={bar}
              clubs={clubs}
              open={openMonth === bar.month}
              onToggle={(month) => setOpenMonth((current) => (current === month ? null : month))}
            />
          ))}
        </View>
      ) : null}
    </View>
  );
}
