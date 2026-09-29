import { IconLoBuilding2, IconLoMapPin } from "@playtopia/icons/react-native";

import type { IconComponent } from "@/shared/config/icons";
import type { TranslationKey } from "@/shared/locales";

interface NetworkTabItem {
  key: string;
  label: TranslationKey;
  Icon: IconComponent;
}

/**
 * Las pestañas de «Red de clubes», en orden: sus sedes y las escuelas donde
 * puede pedir entrar. La primera es la que se ve al abrir la pantalla.
 */
export const NETWORK_TABS = [
  { key: "myClubs", label: "network.tabs.myClubs", Icon: IconLoBuilding2 },
  { key: "nearMe", label: "network.tabs.nearMe", Icon: IconLoMapPin },
] as const satisfies readonly NetworkTabItem[];

export type NetworkTab = (typeof NETWORK_TABS)[number]["key"];
