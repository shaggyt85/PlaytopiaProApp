import { useState } from "react";

import { useTranslation } from "@/shared/hooks/useTranslation";
import { formatHourOfDay } from "@/shared/utils/formatDate";

import type { WeekDay, WeeklyHours } from "../../schemas/weeklyHours.schema";
import { daysWithHours } from "../../utils/daysWithHours";
import { OFFERED_HOURS } from "../../utils/timeBands";
import { toggleHour } from "../../utils/toggleHour";
import { ChipGroup } from "../ChipGroup";
import { WeekDayChips } from "../WeekDayChips";

/** Sin ningún día con horas, «Por día» empieza en el lunes. */
const FIRST_DAY: WeekDay = "1";

interface DayModeProps {
  week: WeeklyHours;
  onChange: (week: WeeklyHours) => void;
}

/**
 * «Por día», como la app de alumnos: se elige un día y se marcan sus horas de
 * una en una, de 06:00 a la última (`OFFERED_HOURS`). Empieza en el primer día
 * con horas.
 */
export function DayMode({ week, onChange }: DayModeProps) {
  const { t } = useTranslation();
  const [day, setDay] = useState<WeekDay>(() => daysWithHours(week)[0] ?? FIRST_DAY);
  const hours = week[day] ?? [];

  return (
    <>
      <WeekDayChips label={t("profile.availability.pickDay")} isSelected={(d) => d === day} onPress={setDay} />
      <ChipGroup
        label={t("profile.availability.dayHours", { day: t(`profile.availability.weekdays.${day}`) })}
        options={OFFERED_HOURS.map((hour) => ({
          key: hour,
          label: formatHourOfDay(hour),
          selected: hours.includes(hour),
        }))}
        onPress={(hour: number) => onChange(toggleHour(week, day, hour))}
        testID="day-hours"
      />
    </>
  );
}
