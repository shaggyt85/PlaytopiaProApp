import { View } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";
import { fullName } from "@/shared/utils/fullName";

import { roleLine } from "../../utils/roleLine";
import { EditableAvatar } from "../EditableAvatar";

import { useStyles } from "./ProfileHeader.styles";

interface ProfileHeaderProps {
  profile: Pick<TeacherProfile, "name" | "last_name" | "avatar" | "experience_years">;
}

/**
 * La cabecera de Perfil, como el prototipo: su foto grande con el aro de marca,
 * su nombre y su rol con los años de experiencia (`roleLine`). La foto se
 * cambia tocándola (`EditableAvatar`).
 */
export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <View style={styles.container} testID="profile-header">
      <EditableAvatar url={profile.avatar} />
      <Text variant="subtitle" align="center" style={styles.name}>
        {fullName(profile)}
      </Text>
      <Text variant="caption" color="textSecondary" align="center">
        {roleLine(profile.experience_years, t)}
      </Text>
    </View>
  );
}
