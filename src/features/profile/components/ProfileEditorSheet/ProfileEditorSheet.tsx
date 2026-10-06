import { BottomSheet } from "@/shared/components/BottomSheet";
import { Text } from "@/shared/components/Text";
import { useTeacherProfile } from "@/shared/hooks/useTeacherProfile";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useProfileEditorStore } from "../../store/profileEditorStore";

import { PROFILE_EDITORS } from "./profileEditors";
import { useStyles } from "./ProfileEditorSheet.styles";

/**
 * El panel de los editores de Perfil. Se monta una vez en `(app)/_layout.tsx`,
 * fuera del `BlurTarget` y por encima de la barra de pestañas, como el de la
 * biometría; qué editor enseña lo dice el store y lo busca en
 * `PROFILE_EDITORS`. Cada vez que se abre, el editor empieza de cero con lo
 * guardado (`key`): lo que se cerró sin guardar no vuelve. Cerrar con la X o
 * tocando fuera descarta los cambios.
 */
export function ProfileEditorSheet() {
  const styles = useStyles();
  const { t } = useTranslation();
  const section = useProfileEditorStore((state) => state.section);
  const close = useProfileEditorStore((state) => state.close);
  const { data: profile } = useTeacherProfile();
  const editor = section ? PROFILE_EDITORS[section] : null;

  return (
    <BottomSheet visible={editor !== null && profile !== undefined} onClose={close}>
      {editor && profile ? (
        <>
          <Text variant="title" accessibilityRole="header" style={styles.title}>
            {t(editor.title)}
          </Text>
          <editor.Editor key={section} profile={profile} onDone={close} />
        </>
      ) : null}
    </BottomSheet>
  );
}
