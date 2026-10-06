import { IconLoChevronRight } from "@playtopia/icons/react-native";
import { Pressable } from "react-native";

import { Text } from "@/shared/components/Text";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useProfileEditorStore, type ProfileSection } from "../../store/profileEditorStore";
import { PROFILE_EDITORS } from "../ProfileEditorSheet/profileEditors";

import { useStyles } from "./EditButton.styles";

/** La › de «Editar» (`h-4 w-4`). */
const ICON_SIZE = 16;

interface EditButtonProps {
  /** Qué abre: su editor en el panel de Perfil. */
  section: ProfileSection;
}

/**
 * «Editar ›» a la derecha del título de una tarjeta de Perfil, en magenta, como
 * el prototipo. Abre su sección él mismo; lo que dice al lector de pantalla sale
 * de `PROFILE_EDITORS`: la tarjeta solo dice cuál.
 */
export function EditButton({ section }: EditButtonProps) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const open = useProfileEditorStore((state) => state.open);
  return (
    <Pressable
      onPress={() => open(section)}
      style={styles.button}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={t(PROFILE_EDITORS[section].editLabel)}
    >
      <Text variant="labelStrong" color="primary">
        {t("profile.edit")}
      </Text>
      <IconLoChevronRight size={ICON_SIZE} color={theme.colors.primary} />
    </Pressable>
  );
}
