import { useMemo, useState } from "react";
import { View } from "react-native";

import { ScreenHeader } from "@/shared/components/ScreenHeader";
import { TabScreen } from "@/shared/components/TabScreen";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { JoinableSchoolsList } from "./components/JoinableSchoolsList";
import { MyClubsList } from "./components/MyClubsList";
import { SegmentedTabs } from "./components/SegmentedTabs";
import { useStyles } from "./NetworkScreen.styles";
import { NETWORK_TABS, type NetworkTab } from "./utils/networkTabs";

/**
 * Red de clubes: sus sedes («Mis clubes») y las escuelas a las que puede pedir
 * unirse («Cerca de mí»). La cabecera y las pestañas se desplazan con la lista.
 *
 * Las dos listas quedan montadas y la que no se ve, oculta: cada pestaña
 * conserva su scroll al volver. «Cerca de mí» no pide nada hasta que se abre.
 * Al abrir la app se empieza siempre en «Mis clubes».
 */
export function NetworkScreen() {
  const styles = useStyles();
  const { t } = useTranslation();
  const [tab, setTab] = useState<NetworkTab>(NETWORK_TABS[0].key);

  const options = useMemo(() => NETWORK_TABS.map(({ key, label, Icon }) => ({ key, label: t(label), Icon })), [t]);

  // Un solo elemento para las dos listas: solo cambia con la pestaña o el idioma.
  const header = useMemo(
    () => (
      <>
        <ScreenHeader title={t("network.title")} />
        <View style={styles.tabs}>
          <SegmentedTabs options={options} value={tab} onChange={setTab} testID="network-tabs" />
        </View>
      </>
    ),
    [t, styles.tabs, options, tab],
  );

  return (
    <TabScreen testID="network-screen">
      <View style={[styles.list, tab !== "myClubs" && styles.hidden]}>
        <MyClubsList header={header} />
      </View>
      <View style={[styles.list, tab !== "nearMe" && styles.hidden]}>
        <JoinableSchoolsList header={header} enabled={tab === "nearMe"} />
      </View>
    </TabScreen>
  );
}
