import { useTranslation } from "@/shared/hooks/useTranslation";

import { EmptyNote } from "../EmptyNote";

/** Un día sin clases: «Día libre · sin compromisos», el mismo en Día, Semana y Mes. */
export function FreeDayCard() {
  const { t } = useTranslation();
  return <EmptyNote message={t("schedule.day.free")} testID="free-day" />;
}
