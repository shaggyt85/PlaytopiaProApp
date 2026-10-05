import { View } from "react-native";

import { Text } from "@/shared/components/Text";

import { useStyles } from "./EmptyNote.styles";

interface EmptyNoteProps {
  /** Ya traducido: «Día libre · sin compromisos», «Aún no hay alumnos apuntados». */
  message: string;
  testID?: string;
}

/**
 * El aviso de que algo está vacío, en su tarjeta: el día libre de Día, Semana y
 * Mes, y una sección del detalle de la clase sin nada que enseñar.
 */
export function EmptyNote({ message, testID }: EmptyNoteProps) {
  const styles = useStyles();
  return (
    <View style={styles.container} testID={testID}>
      <Text variant="small" color="textSecondary" align="center">
        {message}
      </Text>
    </View>
  );
}
