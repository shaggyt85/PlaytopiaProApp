import type { ReactNode } from "react";
import { View } from "react-native";

import { SectionLabel } from "../SectionLabel";

import { useStyles } from "./DetailSection.styles";

interface DetailSectionProps {
  /** Ya traducido: «Club», «Alumnos»… */
  title: string;
  children: ReactNode;
  testID?: string;
}

/** Una sección del detalle de la clase (`pt-5`): su título y, debajo, su contenido. */
export function DetailSection({ title, children, testID }: DetailSectionProps) {
  const styles = useStyles();
  return (
    <View style={styles.section} testID={testID}>
      <SectionLabel label={title} />
      {children}
    </View>
  );
}
