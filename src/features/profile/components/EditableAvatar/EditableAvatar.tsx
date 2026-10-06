import { IconLoCamera } from "@playtopia/icons/react-native";
import { ActivityIndicator, View } from "react-native";

import { TeacherAvatar } from "@/shared/components/TeacherAvatar";
import { useTheme } from "@/shared/hooks/useTheme";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useChangeAvatar } from "../../hooks/useChangeAvatar";

import { useStyles } from "./EditableAvatar.styles";

/** La cámara de la insignia (`h-4 w-4`). */
const ICON_SIZE = 16;

/**
 * La foto de la cabecera de Perfil, que se puede cambiar, como el prototipo:
 * `TeacherAvatar` grande con la insignia de la cámara abajo a la derecha.
 * Tocarla abre de dónde sacar la foto (`useChangeAvatar`); mientras sube, un
 * velo con el indicador y no se puede tocar. La insignia y el velo, encima y
 * al final, sin `zIndex`; la insignia no recibe toques: tocarla es tocar la foto.
 */
export function EditableAvatar({ url }: { url: string | null | undefined }) {
  const styles = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const { change, uploading } = useChangeAvatar();
  return (
    <View style={styles.container}>
      <TeacherAvatar
        url={url}
        size="xl"
        onPress={change}
        busy={uploading}
        accessibilityLabel={t("profile.avatar.change")}
      />
      <View style={styles.badge} pointerEvents="none">
        <IconLoCamera size={ICON_SIZE} color={theme.colors.text} />
      </View>
      {uploading ? (
        <View style={styles.busy} pointerEvents="none" testID="avatar-uploading">
          <ActivityIndicator color={theme.colors.text} />
        </View>
      ) : null}
    </View>
  );
}
