import { View } from "react-native";

import { DataState } from "@/shared/components/DataState";
import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabScreen } from "@/shared/components/TabScreen";
import { TabScrollView } from "@/shared/components/TabScrollView";
import { useTeacherProfile } from "@/shared/hooks/useTeacherProfile";
import { useTranslation } from "@/shared/hooks/useTranslation";

import {
  AvailabilityCard,
  DeleteAccountButton,
  HoursCard,
  MyClubsCard,
  PersonalDataCard,
  ProfessionalCard,
  ProfileHeader,
  SignOutButton,
} from "./components";
import { useStyles } from "./ProfileScreen.styles";

/**
 * Perfil, como el prototipo: su cabecera (foto, nombre y rol), sus horas del
 * mes con el historial, sus datos personales, su perfil profesional, los clubes
 * donde trabaja, su disponibilidad por sede, cerrar sesión y borrar la cuenta.
 * Solo compone: cada dato sale de su caché (el perfil que dejó el login, «Mis
 * clubes» y, para las horas y la disponibilidad, `useProfileDetails`, una sola
 * petición). Los editores y la baja se abren en su panel (`ProfileEditorSheet`).
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
                <HoursCard />
                <PersonalDataCard profile={profile} />
                <ProfessionalCard profile={profile} />
                <MyClubsCard />
                <AvailabilityCard />
                <SignOutButton />
                <DeleteAccountButton />
              </View>
            </>
          ) : null}
        </DataState>
      </TabScrollView>
    </TabScreen>
  );
}
