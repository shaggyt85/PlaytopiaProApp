import { IconLoUser } from "@playtopia/icons/react-native";

import { IconText } from "@/shared/components/IconText";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import { personalRows } from "../../utils/personalRows";
import { EditButton } from "../EditButton";
import { ProfileCard } from "../ProfileCard";

interface PersonalDataCardProps {
  profile: Pick<TeacherProfile, "email" | "phone_number" | "birthday" | "gender">;
}

/**
 * «Datos personales»: email, teléfono y, si los tiene, nacimiento y género
 * (`personalRows`). «Editar» abre su editor en el panel de Perfil.
 */
export function PersonalDataCard({ profile }: PersonalDataCardProps) {
  const { t } = useTranslation();
  return (
    <ProfileCard
      Icon={IconLoUser}
      title={t("profile.personal.title")}
      aside={<EditButton section="personal" />}
      testID="personal-data-card"
    >
      {personalRows(profile, t).map(({ key, Icon, label }) => (
        <IconText key={key} Icon={Icon} label={label} size="card" iconColor="textSecondary" />
      ))}
    </ProfileCard>
  );
}
