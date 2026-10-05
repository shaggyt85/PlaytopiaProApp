import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { BlurTarget, BlurTargetProvider } from "@/shared/components/BlurTarget";
import { BrandBackground } from "@/shared/components/BrandBackground";

import { useStyles } from "./DetailFrame.styles";

interface DetailFrameProps {
  children: ReactNode;
  /** Su panel (`BottomSheet`), si lo tiene: va fuera del `BlurTarget`, que es lo que desenfoca al abrirse. */
  sheet?: ReactNode;
  testID?: string;
}

/**
 * El marco de una pantalla de detalle (una clase, un grupo): el fondo de marca y
 * las zonas seguras, porque va encima de las pestañas, que ponen los suyos. Su
 * panel, fuera del `BlurTarget` de la pantalla.
 */
export function DetailFrame({ children, sheet, testID }: DetailFrameProps) {
  const styles = useStyles();
  return (
    <BrandBackground testID={testID}>
      <BlurTargetProvider>
        <BlurTarget>
          <SafeAreaView style={styles.safe} edges={["top", "bottom"]}>
            {children}
          </SafeAreaView>
        </BlurTarget>
        {sheet}
      </BlurTargetProvider>
    </BrandBackground>
  );
}
