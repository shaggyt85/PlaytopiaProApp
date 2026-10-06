import { useState } from "react";

import { useTranslation } from "@/shared/hooks/useTranslation";

import type { WeeklyHours } from "../../schemas/weeklyHours.schema";
import { applyBands, bandsOf, TIME_BANDS, type BandId, type BandSelection } from "../../utils/timeBands";
import { toggleIn } from "../../utils/toggleIn";
import { ChipGroup } from "../ChipGroup";
import { WeekDayChips } from "../WeekDayChips";

interface BandsModeProps {
  week: WeeklyHours;
  onChange: (week: WeeklyHours) => void;
}

/**
 * «Por franja»: las franjas y los días marcados. Lo marcado es su entrada (se
 * pueden marcar días antes que franjas): al entrar sale de la semana
 * (`bandsOf`) y cada cambio rehace la semana con ello (`applyBands`), como en
 * la app de alumnos.
 */
export function BandsMode({ week, onChange }: BandsModeProps) {
  const { t } = useTranslation();
  const [selection, setSelection] = useState<BandSelection>(() => bandsOf(week));

  const select = (next: BandSelection) => {
    setSelection(next);
    onChange(applyBands(next));
  };

  return (
    <>
      <ChipGroup
        label={t("profile.availability.bandsTitle")}
        options={TIME_BANDS.map((band) => ({
          key: band.id,
          label: t(band.label),
          selected: selection.bands.includes(band.id),
        }))}
        onPress={(band: BandId) => select({ ...selection, bands: toggleIn(selection.bands, band) })}
      />
      <WeekDayChips
        label={t("profile.availability.daysTitle")}
        isSelected={(day) => selection.days.includes(day)}
        onPress={(day) => select({ ...selection, days: toggleIn(selection.days, day) })}
      />
    </>
  );
}
