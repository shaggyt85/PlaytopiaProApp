import { IconLoSparkles } from "@playtopia/icons/react-native";

import { PromptSheet } from "@/shared/components/PromptSheet";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { openExternalUrl } from "@/shared/utils/openExternalUrl";

import { UPDATE_NOTICES } from "../../config/updateNotices";

const NOTICE = UPDATE_NOTICES.soft;

interface SoftUpdateSheetProps {
  visible: boolean;
  storeUrl: string;
  /** «Ahora no», la X o tocar fuera: no vuelve hasta que se cierre la app. */
  onDismiss: () => void;
}

/** Hay una versión nueva: se ofrece, y se puede dejar para luego. */
export function SoftUpdateSheet({ visible, storeUrl, onDismiss }: SoftUpdateSheetProps) {
  const { t } = useTranslation();
  return (
    <PromptSheet
      visible={visible}
      onClose={onDismiss}
      Icon={IconLoSparkles}
      title={t(NOTICE.title)}
      subtitle={t(NOTICE.message)}
      primary={{ title: t(NOTICE.action), onPress: () => openExternalUrl(storeUrl, t) }}
      secondary={{ title: t("common.notNow"), onPress: onDismiss }}
      testID="soft-update-sheet"
    />
  );
}
