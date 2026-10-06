import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabScreen } from "@/shared/components/TabScreen";
import { TabScrollView } from "@/shared/components/TabScrollView";
import { useTeacherProfile } from "@/shared/hooks/useTeacherProfile";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { MyClubsCard, PersonalDataCard, ProfessionalCard, ProfileHeader, SignOutButton } from "./components";
import { useStyles } from "./ProfileScreen.styles";

/**
 * Perfil, como el prototipo: su cabecera (foto, nombre y rol), sus datos
 * personales, su perfil profesional, los clubes donde trabaja y cerrar sesión.
 * Solo compone: cada dato sale de su caché (el perfil que dejó el login y «Mis
 * clubes»), así que al llegar desde la agenda ya está. Las horas, la
 * disponibilidad y los editores llegan en sus fases.
 */
export function ProfileScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const { data: profile, error, refetch } = useTeacherProfile();
  return (
    <TabScreen testID="profile-screen">
      <TabScrollView>
        <ScreenHeader title={t("profile.title")} />
        <DataState hasData={profile !== undefined} error={error} onRetry={refetch}>
          {profile ? (
            <>
              <ProfileHeader profile={profile} />
              <View style={styles.content}>
                <PersonalDataCard profile={profile} />
                <ProfessionalCard profile={profile} />
                <MyClubsCard />
                <SignOutButton />
              </View>
            </>
          ) : null}
        </DataState>
      </TabScrollView>
    </TabScreen>
  );
}
