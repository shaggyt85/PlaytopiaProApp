import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { BrandBackground } from "@/shared/components/BrandBackground";
import { Button } from "@/shared/components/Button";
import { LogoSection } from "@/shared/components/LogoSection";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";
import { openExternalUrl } from "@/shared/utils/openExternalUrl";

import { UPDATE_NOTICES } from "../../config/updateNotices";

import { useStyles } from "./ForceUpdateScreen.styles";

const NOTICE = UPDATE_NOTICES.force;

/**
 * Esta versión ya no vale: ocupa la app entera, sin nada detrás que tocar ni
 * forma de cerrarla. El botón lleva a la tienda; si Core no tiene su URL, el
 * texto dice dónde actualizarla.
 */
export function ForceUpdateScreen({ storeUrl }: { storeUrl: string | null }) {
  const styles = useStyles();
  const { t } = useTranslation();
  return (
    <BrandBackground testID="force-update-screen">
      <SafeAreaView style={styles.flex}>
        <View style={styles.content}>
          <LogoSection />
          <View style={styles.text}>
            <Text variant="title" align="center" accessibilityRole="header">
              {t(NOTICE.title)}
            </Text>
            <Text color="textSecondary" align="center">
              {t(NOTICE.message)}
            </Text>
          </View>
          {storeUrl ? (
            <Button title={t(NOTICE.action)} onPress={() => openExternalUrl(storeUrl, t)} />
          ) : (
            <Text color="textSecondary" align="center">
              {t("appUpdate.noStore")}
            </Text>
          )}
        </View>
      </SafeAreaView>
    </BrandBackground>
  );
}
