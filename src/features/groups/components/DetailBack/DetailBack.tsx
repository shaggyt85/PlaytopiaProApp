import { IconLoChevronLeft } from "@playtopia/icons/react-native";

import { IconButton } from "@/shared/components/IconButton";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { BACK_SIZE } from "./DetailBack.styles";

/**
 * La ‹ de arriba a la izquierda de las pantallas de grupos, como el prototipo:
 * un círculo de superficie con la flecha. La usan el detalle de un grupo y la
 * ficha de un alumno (el de una clase lleva la suya, sobre su color).
 */
export function DetailBack({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return <IconButton Icon={IconLoChevronLeft} size={BACK_SIZE} accessibilityLabel={t("common.back")} onPress={onPress} />;
}
