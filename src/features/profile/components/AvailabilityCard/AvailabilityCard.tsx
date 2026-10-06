import { IconLoCalendarDays, IconLoClock } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { IconText } from "@/shared/components/IconText";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { sedeKey } from "@/shared/utils/sedeKey";

import { useProfileDetails } from "../../hooks/useProfileDetails";
import { availabilitySummary } from "../../utils/availabilitySummary";
import { ClubName } from "../ClubName";
import { ProfileCard } from "../ProfileCard";

import { useStyles } from "./AvailabilityCard.styles";

/**
 * «Disponibilidad», como el prototipo pero por sede, porque cada sede tiene su
 * horario: su nombre (`ClubName`), «3 días · 14 h semanales» y sus tramos de
 * lunes a domingo (`availabilitySummary`). La misma petición que las horas
 * (`useProfileDetails`) y sus propios estados. Sin «Editar» hasta su editor.
 */
export function AvailabilityCard() {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data, error, refetch } = useProfileDetails();
  const { clubOf } = useScheduleClubs();
  return (
    <ProfileCard Icon={IconLoCalendarDays} title={t("profile.availability.title")} testID="availability-card">
      <DataState hasData={data !== undefined} error={error} onRetry={refetch}>
        {data && data.availability.length > 0 ? (
          <View style={styles.clubs}>
            {data.availability.map((sede) => {
              const club = clubOf(sede);
              const summary = availabilitySummary(sede.week, t);
              return (
                <View key={sedeKey(sede)} style={styles.club} testID={`availability-${sedeKey(sede)}`}>
                  <ClubName club={{ ...club, label: club.label || (sede.club_name ?? sede.school_name) }} />
                  <Text variant="caption">{summary.title}</Text>
                  {summary.detail ? (
                    <IconText Icon={IconLoClock} label={summary.detail} size="card" iconColor="textSecondary" />
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : (
          <Text variant="caption" color="textSecondary">
            {t("profile.clubs.empty")}
          </Text>
        )}
      </DataState>
    </ProfileCard>
  );
}
