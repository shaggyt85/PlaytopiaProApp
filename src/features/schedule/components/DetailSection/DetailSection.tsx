import type { ReactNode } from "react";
import { View } from "react-native";

import { SectionLabel } from "../SectionLabel";

import { useStyles } from "./DetailSection.styles";

interface DetailSectionProps {
  /** Ya traducido: «Alumnos y asistencia»… */
  title: string;
  /** Lo que va a la derecha del título: «2/4 presentes». */
  aside?: ReactNode;
  children: ReactNode;
  testID?: string;
}

/** Una sección del detalle de la clase (`pt-5`): su título, lo de su derecha y, debajo, su contenido. */
export function DetailSection({ title, aside, children, testID }: DetailSectionProps) {
  const styles = useStyles();
  return (
    <View style={styles.section} testID={testID}>
      <View style={styles.head}>
        <SectionLabel label={title} />
        {aside}
      </View>
      {children}
    </View>
  );
}
