import { IconLoBriefcase } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import type { TeacherProfile } from "@/shared/schemas/teacherProfile.schema";

import { professionalTags } from "../../utils/professionalTags";
import { EditButton } from "../EditButton";
import { ProfileCard } from "../ProfileCard";

import { useStyles } from "./ProfessionalCard.styles";

interface ProfessionalCardProps {
  profile: Pick<TeacherProfile, "description" | "sports">;
}

/**
 * «Perfil profesional»: su presentación y lo que da (`professionalTags`), con
 * los nombres que traduce Core. Los niveles del prototipo aún no existen en
 * Core: no salen. Sin nada, lo dice. «Editar» abre su editor en el panel de Perfil.
 */
export function ProfessionalCard({ profile }: ProfessionalCardProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const tags = professionalTags(profile.sports);
  const description = profile.description?.trim();
  return (
    <ProfileCard
      Icon={IconLoBriefcase}
      title={t("profile.professional.title")}
      aside={<EditButton section="professional" />}
      testID="professional-card"
    >
      {description ? (
        <Text variant="caption" color="textSecondary">
          {description}
        </Text>
      ) : null}
      {tags.length > 0 ? (
        <View style={styles.tags}>
          {tags.map(({ key, label }) => (
            <Chip key={key} label={label} tone="neutral" dot={false} />
          ))}
        </View>
      ) : null}
      {!description && tags.length === 0 ? (
        <Text variant="caption" color="textSecondary">
          {t("profile.professional.empty")}
        </Text>
      ) : null}
    </ProfileCard>
  );
}
