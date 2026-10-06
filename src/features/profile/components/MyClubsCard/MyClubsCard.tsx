import { IconLoBuilding2 } from "@playtopia/icons/react-native";

import { DataState } from "@/shared/components/DataState";
import { Text } from "@/shared/components/Text";
import { useScheduleClubs } from "@/shared/hooks/useScheduleClubs";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { ClubName } from "../ClubName";
import { ProfileCard } from "../ProfileCard";

/**
 * «Clubes donde trabajas», solo de lectura: las sedes donde está inscrito
 * («Mis clubes», la misma caché que la agenda), cada una con el nombre y el
 * color que tiene en la agenda (`ClubName`). Sus propios estados, para que si
 * falla no se lleve el resto del perfil.
 */
export function MyClubsCard() {
  const { t } = useTranslation();
  const { clubs, hasData, error, refetch } = useScheduleClubs();
  return (
    <ProfileCard Icon={IconLoBuilding2} title={t("profile.clubs.title")} testID="my-clubs-card">
      <DataState hasData={hasData} error={error} onRetry={refetch}>
        {clubs.length > 0 ? (
          clubs.map((club) => <ClubName key={club.key} club={club} />)
        ) : (
          <Text variant="caption" color="textSecondary">
            {t("profile.clubs.empty")}
          </Text>
        )}
      </DataState>
    </ProfileCard>
  );
}
