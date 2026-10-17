import { IconLoX } from "@playtopia/icons/react-native";
import { View } from "react-native";

import { IconButton } from "@/shared/components/IconButton";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { CLOSE_SIZE, useStyles } from "./CloseButton.styles";

interface CloseButtonProps {
  onPress: () => void;
  /**
   * En la esquina de arriba a la derecha de su panel (`BottomSheet`,
   * `SideSheet`). Va como último hijo del panel: se pinta encima por orden, sin
   * `zIndex`.
   */
  corner?: boolean;
  /** Lo que baja de más en la esquina (el panel lateral empieza bajo la barra de estado). */
  extraTop?: number;
}

/** La X que cierra un panel (`BottomSheet`, el buscador de países), con «Cerrar» para el lector de pantalla. */
export function CloseButton({ onPress, corner = false, extraTop = 0 }: CloseButtonProps) {
  const styles = useStyles();
  const { t } = useTranslation();
  const button = <IconButton Icon={IconLoX} size={CLOSE_SIZE} onPress={onPress} accessibilityLabel={t("common.close")} />;
  if (!corner) return button;
  return <View style={[styles.corner, { top: styles.corner.top + extraTop }]}>{button}</View>;
}
