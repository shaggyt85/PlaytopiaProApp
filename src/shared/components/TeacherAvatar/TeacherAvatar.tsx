import { Image } from "expo-image";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";

import { useStyles, type TeacherAvatarSize } from "./TeacherAvatar.styles";

const IMAGE_FADE_MS = 200;

/** Los estilos de cada tamaño, por su nombre: un tamaño nuevo es una entrada aquí y en `AVATAR_SIZES`. */
const STYLE_KEYS = {
  md: { ring: "ringMd", gradient: "gradientMd", photo: "photoMd" },
  xl: { ring: "ringXl", gradient: "gradientXl", photo: "photoXl" },
} as const satisfies Record<TeacherAvatarSize, Record<string, keyof ReturnType<typeof useStyles>>>;

interface TeacherAvatarProps {
  /** La foto del perfil (`avatar`): la suya o la de por defecto, la pone Core. */
  url: string | null | undefined;
  /** `md` en la cabecera de la Agenda (por defecto), `xl` en la de Perfil. */
  size?: TeacherAvatarSize;
  /** Si se puede tocar (la Agenda lleva a Perfil). Sin él, es solo la foto. */
  onPress?: () => void;
  /** Lo que dice el lector de pantalla: a dónde lleva o de quién es la foto. */
  accessibilityLabel?: string;
}

/**
 * La foto del profesor con el aro de marca, como el prototipo: en la cabecera
 * de la Agenda y en la de Perfil. Mientras llega el perfil, o si la foto no
 * carga, queda el círculo vacío: sin foto propia, Core ya manda la de por
 * defecto, así que nunca hay iniciales.
 */
export function TeacherAvatar({ url, size = "md", onPress, accessibilityLabel }: TeacherAvatarProps) {
  const styles = useStyles();
  const keys = STYLE_KEYS[size];
  const reduceMotion = useReduceMotion();
  // El fallo es de esta URL: si llega otra (el perfil se renueva), se vuelve a intentar.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showImage = Boolean(url) && failedUrl !== url;

  const content = (
    <>
      <BrandGradient style={styles[keys.gradient]} />
      <View style={styles[keys.photo]}>
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
    </>
  );

  return onPress ? (
    <Pressable
      style={styles[keys.ring]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      testID="teacher-avatar"
    >
      {content}
    </Pressable>
  ) : (
    <View
      style={styles[keys.ring]}
      accessible={Boolean(accessibilityLabel)}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      testID="teacher-avatar"
    >
      {content}
    </View>
  );
}
