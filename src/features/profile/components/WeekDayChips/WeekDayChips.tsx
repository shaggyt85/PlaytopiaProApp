import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatWeekdayInitials } from "@/shared/utils/formatDate";

import { WEEK_DISPLAY_ORDER, type WeekDay } from "../../schemas/weeklyHours.schema";
import { ChipGroup } from "../ChipGroup";

interface WeekDayChipsProps {
  label: string;
  isSelected: (day: WeekDay) => boolean;
  onPress: (day: WeekDay) => void;
}

/**
 * Los días L–D, de lunes a domingo (`WEEK_DISPLAY_ORDER`), con su letra en el
 * idioma de la app y su nombre para el lector de pantalla. En «Por franja» se
 * marcan varios; en «Por día», el que se edita.
 */
export function WeekDayChips({ label, isSelected, onPress }: WeekDayChipsProps) {
  const { t } = useTranslation();
  const letters = formatWeekdayInitials();
  return (
    <ChipGroup
      label={label}
      options={WEEK_DISPLAY_ORDER.map((day, index) => ({
        key: day,
        label: letters[index],
        accessibilityLabel: t(`profile.availability.weekdays.${day}`),
        selected: isSelected(day),
      }))}
      onPress={onPress}
    />
  );
}
