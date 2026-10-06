import { IconLoClock } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { courtTimeLabel } from "@/shared/utils/courtTime";
import { formatMonthName } from "@/shared/utils/formatDate";

import { useProfileDetails } from "../../hooks/useProfileDetails";
import { clubBreakdown, currentMonth } from "../../utils/monthHours";
import { ClubHoursRow } from "../ClubHoursRow";
import { HoursHistory } from "../HoursHistory";
import { ProfileCard } from "../ProfileCard";

import { useStyles } from "./HoursCard.styles";

/**
 * «Horas este mes», como el prototipo: el mes a la derecha, las horas
 * planificadas del mes («12:00 h», exactas, `courtTimeLabel`), las clases dadas
 * de las planificadas («8 de 11 clases en pista») y cada sede con lo hecho de
 * lo planificado y la barra de su avance; debajo, el historial. Pide las horas al abrir Perfil
 * (`useProfileDetails`) y tiene sus propios estados: si fallan, el resto del
 * perfil se ve igual.
 */
export function HoursCard() {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { data, error, refetch } = useProfileDetails();
  const { clubOf } = useScheduleClubs();
  const month = data ? currentMonth(data.hours) : undefined;
  const clubs = data && month ? clubBreakdown(month, data.hours.clubs, clubOf) : [];

  return (
    <ProfileCard
      Icon={IconLoClock}
      iconColor={theme.accents.gold.color}
      title={t("profile.hours.title")}
      aside={
        month ? (
          <Text variant="metaStrong" color="textSecondary">
            {formatMonthName(month.month)}
          </Text>
        ) : null
      }
      testID="hours-card"
    >
      <DataState hasData={data !== undefined} error={error} onRetry={refetch}>
        {data && month ? (
          <>
            <Text variant="hero">{courtTimeLabel(month.total.planned_minutes, t)}</Text>
            <Text variant="small" color="textSecondary" style={styles.classes}>
              {t("profile.hours.classes", { done: month.total.done_classes, count: month.total.planned_classes })}
            </Text>
            {clubs.length > 0 ? (
              <View style={styles.clubs}>
                {clubs.map((club) => (
                  <ClubHoursRow key={club.key} club={club} />
                ))}
              </View>
            ) : (
              <Text variant="caption" color="textSecondary">
                {t("profile.clubs.empty")}
              </Text>
            )}
            <HoursHistory hours={data.hours} />
          </>
        ) : null}
      </DataState>
    </ProfileCard>
  );
}
