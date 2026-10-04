import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./TeacherAvatar.styles";

const IMAGE_FADE_MS = 200;

interface TeacherAvatarProps {
  /** La foto del perfil (`avatar`): la suya o la de por defecto, la pone Core. */
  url: string | null | undefined;
}

/**
 * La foto del profesor en la cabecera de la Agenda, con el aro de marca, como el
 * prototipo. Lleva a Perfil. Mientras llega el perfil, o si la foto no carga,
 * queda el círculo vacío: sin foto propia, Core ya manda la de por defecto.
 */
export function TeacherAvatar({ url }: TeacherAvatarProps) {
  const styles = useStyles();
  const router = useRouter();
  const reduceMotion = useReduceMotion();
  const { t } = useTranslation();
  // El fallo es de esta URL: si llega otra (el perfil se renueva), se vuelve a intentar.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(url) && failedUrl !== url;

  return (
    <Pressable
      style={styles.ring}
      onPress={() => router.navigate("/profile")}
      accessibilityRole="button"
      accessibilityLabel={t("schedule.myProfile")}
      testID="teacher-avatar"
    >
      <BrandGradient style={styles.gradient} />
      <View style={styles.photo}>
        {showImage && url ? (
          <Image
            source={{ uri: url }}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
            cachePolicy="memory-disk"
            transition={reduceMotion ? 0 : IMAGE_FADE_MS}
            onError={() => setFailedUrl(url)}
            accessible={false}
            testID="teacher-avatar-image"
          />
        ) : null}
      </View>
    </Pressable>
  );
}
