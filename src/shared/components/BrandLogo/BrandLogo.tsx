import { Image, type ImageStyle } from "expo-image";
import type { StyleProp } from "react-native";

import { BRAND_ASSETS } from "@/shared/config/assets";

interface BrandLogoProps {
  size: number;
  style?: StyleProp<ImageStyle>;
}

/**
 * Logo blanco de Playtopia. Con caché en memoria y sin fundido: como se
 * precarga al arrancar (`preloadBrandAssets`), sale al instante en cada
 * pantalla.
 */
export function BrandLogo({ size, style }: BrandLogoProps) {
  return (
    <Image
      source={BRAND_ASSETS.logoWhite}
      style={[{ width: size, height: size }, style]}
      contentFit="contain"
      cachePolicy="memory-disk"
      transition={0}
      accessibilityIgnoresInvertColors
    />
  );
}
