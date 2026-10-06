import { IconLoCalendarDays } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { sedeKey } from "@/shared/utils/sedeKey";

import { useProfileDetails } from "../../hooks/useProfileDetails";
import { availabilitySummary } from "../../utils/availabilitySummary";
import { profileClubLabel } from "../../utils/profileClubLabel";
import { ClubName } from "../ClubName";
import { EditButton } from "../EditButton";
import { ProfileCard } from "../ProfileCard";

import { useStyles } from "./AvailabilityCard.styles";

/**
 * «Disponibilidad», como el prototipo pero por sede, porque cada sede tiene su
 * horario: su nombre (`ClubName`) y «3 días · 14 h semanales»
 * (`availabilitySummary`). Los tramos de cada día se ven en el editor, que
 * abre «Editar». La misma petición que las horas (`useProfileDetails`) y sus
 * propios estados.
 */
export function AvailabilityCard() {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data, error, refetch } = useProfileDetails();
  const { clubOf } = useScheduleClubs();
  return (
    <ProfileCard
      Icon={IconLoCalendarDays}
      title={t("profile.availability.title")}
      aside={<EditButton section="availability" />}
      testID="availability-card"
    >
      <DataState hasData={data !== undefined} error={error} onRetry={refetch}>
        {data && data.availability.length > 0 ? (
          <View style={styles.clubs}>
            {data.availability.map((sede) => (
              <View key={sedeKey(sede)} style={styles.club} testID={`availability-${sedeKey(sede)}`}>
                <ClubName club={{ ...clubOf(sede), label: profileClubLabel(sede, clubOf) }} />
                <Text variant="caption">{availabilitySummary(sede.week, t)}</Text>
              </View>
            ))}
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
