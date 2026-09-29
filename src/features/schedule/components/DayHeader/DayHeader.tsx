import { View } from "react-native";

import { Chip } from "@/shared/components/Chip";
import { Text } from "@/shared/components/Text";
import { useTranslation } from "@/shared/hooks/useTranslation";

import { useStyles } from "./DayHeader.styles";

interface DayHeaderProps {
  /** El nombre del día ya compuesto (`dayLabel`): «Hoy · lunes 5». */
  label: string;
  /** Sin datos todavía (cargando o error), no se enseña: «0 clases» no sería verdad. */
  classCount?: number;
}

/** Encima de la tira: la pastilla del día («● HOY · LUNES 5») y cuántas clases tiene. */
export function DayHeader({ label, classCount }: DayHeaderProps) {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Chip label={label} />
      {classCount === undefined ? null : (
        <Text variant="meta" color="textSecondary">
          {t("schedule.day.classes", { count: classCount })}
        </Text>
      )}
    </View>
  );
}
