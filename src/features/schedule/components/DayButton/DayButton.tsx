import { memo } from "react";
import { Pressable, View, type StyleProp, type ViewStyle } from "react-native";

import { BrandGradient } from "@/shared/components/BrandGradient";
import { Text } from "@/shared/components/Text";
import type { TextVariant } from "@/shared/config/theme";
import { formatDayOfMonth } from "@/shared/utils/formatDate";

import type { DayMark } from "../../utils/dayMark";
import { DayDots } from "../DayDots";

import { DAY_MARK_COLORS, useStyles } from "./DayButton.styles";

interface DayButtonProps {
  /** El día, `YYYY-MM-DD`: se lo pasa a `onPick` al tocarlo. */
  date: string;
  mark: DayMark;
  /** La forma de quien lo usa: la pastilla de la tira o la celda del mes. */
  shape: StyleProp<ViewStyle>;
  /** El radio de esa forma, para el degradado del elegido. */
  radius: number;
  /** La letra del día encima del número (solo en la tira). */
  letter?: string;
  /** El número: grande en la tira (`subtitle`) y más pequeño en el mes (`rowTitle`). */
  numberVariant: TextVariant;
  dots: readonly string[];
  /** El punto coral de hoy arriba a la derecha (solo en la tira, si hoy no es el elegido). */
  todayMark?: boolean;
  onPick: (date: string) => void;
  /** Ya traducido: «miércoles 18, 3 clases». */
  accessibilityLabel: string;
  testID?: string;
}

/**
 * Un día que se puede tocar, con sus tres aspectos: elegido (el degradado de
 * marca en relieve), hoy sin elegir (el aro de marca) y los demás. Lo usan la
 * pastilla de la tira de la semana y la celda del mes, que solo ponen su forma:
 * así los tres aspectos se escriben una vez.
 *
 * `memo` y solo datos en las props (sin funciones por día ni elementos): al
 * elegir otro día solo se repintan los dos que cambian de aspecto.
 */
export const DayButton = memo(function DayButton({
  date,
  mark,
  shape,
  radius,
  letter,
  numberVariant,
  dots,
  todayMark = false,
  onPick,
  accessibilityLabel,
  testID,
}: DayButtonProps) {
  const styles = useStyles();
  const selected = mark === "selected";
  const colors = DAY_MARK_COLORS[mark];

  return (
    <Pressable
      onPress={() => onPick(date)}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      accessibilityLabel={accessibilityLabel}
      style={[styles.base, shape, styles[mark]]}
      testID={testID}
    >
      {selected ? <BrandGradient style={[styles.fill, { borderRadius: radius }]} /> : null}
      {letter ? (
        <Text variant="chip" color={colors.label}>
          {letter}
        </Text>
      ) : null}
      <Text variant={numberVariant} color={colors.number}>
        {formatDayOfMonth(date)}
      </Text>
      <DayDots colors={dots} onBrand={selected} />
      {todayMark && mark === "today" ? <View style={styles.todayMark} testID="day-today-mark" /> : null}
    </Pressable>
  );
});
