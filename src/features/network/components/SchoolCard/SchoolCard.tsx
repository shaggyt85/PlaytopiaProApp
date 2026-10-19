import { IconLoMapPin } from "@playtopia/icons/react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { memo, useState } from "react";
import { StyleSheet, View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { IconText } from "@/shared/components/IconText";
import { StripeCard } from "@/shared/components/StripeCard";
import { Text } from "@/shared/components/Text";
import { useReduceMotion } from "@/shared/hooks/useReduceMotion";
import { useTheme } from "@/shared/hooks/useTheme";
import type { SchoolCard as SchoolCardData } from "@/shared/schemas/schoolCard.schema";
import { branchKey } from "@/shared/utils/branchKey";

import { schoolLocation } from "../../utils/schoolLocation";

import { useStyles } from "./SchoolCard.styles";

/** Fundido de la portada al llegar; sin él con «reducir movimiento». */
const IMAGE_FADE_MS = 200;

interface SchoolCardProps {
  card: SchoolCardData;
  testID?: string;
}

/**
 * La tarjeta de una sede, con el formato de las tarjetas del prototipo: la
 * franja de marca a la izquierda, el chip de la sede, el nombre de la escuela y
 * la línea de ubicación. Detrás, la portada con un velo que deja leer el texto.
 *
 * Si la portada no carga, queda el fondo del tema. `memo` y `recyclingKey`
 * porque va en listas largas: una fila reciclada no enseña la portada de otra.
 */
export const SchoolCard = memo(function SchoolCard({ card, testID }: SchoolCardProps) {
  const styles = useStyles();
  const theme = useTheme();
  const reduceMotion = useReduceMotion();
  // El fallo es de esta URL: si la fila se recicla para otra sede, se vuelve a intentar.
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const location = schoolLocation(card);
  const showImage = failedUrl !== card.background_url;

  return (
    <StripeCard stripe={theme.gradients.brand} testID={testID}>
      {showImage ? (
        <Image
          source={{ uri: card.background_url }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="memory-disk"
          recyclingKey={branchKey(card)}
          transition={reduceMotion ? 0 : IMAGE_FADE_MS}
          onError={() => setFailedUrl(card.background_url)}
          accessible={false}
          testID={testID ? `${testID}-image` : undefined}
        />
      ) : null}
      <LinearGradient
        colors={theme.gradients.imageVeil}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        style={styles.content}
        accessible
        accessibilityLabel={[card.name, card.club_name, location].filter(Boolean).join(", ")}
      >
        {card.club_name ? <Chip label={card.club_name} /> : null}
        <Text variant="cardTitle" numberOfLines={2}>
          {card.name}
        </Text>
        {location ? <IconText Icon={IconLoMapPin} label={location} numberOfLines={1} /> : null}
      </View>
    </StripeCard>
  );
});
