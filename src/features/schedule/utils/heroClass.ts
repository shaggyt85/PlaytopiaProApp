import type { t as translate } from "@/shared/config/i18n";
import type { NextClass, ScheduleClass } from "@/shared/schemas/schedule.schema";
import { classSpan } from "@/shared/utils/classTimeRange";
import { formatClubTime, formatWeekdayShortDay } from "@/shared/utils/formatDate";

import { classStatus } from "./classTiming";
import { addDays } from "./scheduleDates";

const MINUTE_MS = 60_000;
/** Hasta una hora antes, la próxima dice cuánto falta («EN 45 MIN»); después, a qué hora. */
const SOON_MINUTES = 60;

/** La clase de la tarjeta de arriba: la que se está dando o, si no hay, la próxima. */
export type HeroClass = { item: ScheduleClass; live: true } | { item: NextClass; live: false };

/**
 * La clase que va en la tarjeta de arriba, como el prototipo: la que está en
 * curso ahora (de las de hoy, con `classStatus`) y, si no hay ninguna, la
 * próxima según Core (`next_class`). Si coinciden dos en curso, la que empezó
 * antes.
 */
export function heroClass(
  todayClasses: readonly ScheduleClass[],
  next: NextClass | null,
  nowWall: number,
): HeroClass | null {
  const live = todayClasses
    .filter((c) => classStatus(c, nowWall, undefined) === "live")
    .sort((a, b) => classSpan(a).start - classSpan(b).start)[0];
  if (live) return { item: live, live: true };
  return next ? { item: next, live: false } : null;
}

/**
 * La etiqueta de la tarjeta: «En curso» o «Próxima clase · …» con cuándo
 * empieza: «en 45 min» (si es hoy y falta una hora o menos), «hoy 18:00»,
 * «mañana 18:00» o «jue 18 · 18:00». La hora, la de pared de su club.
 */
export function heroLabel(hero: HeroClass, today: string, nowMs: number, t: typeof translate): string {
  if (hero.live) return t("schedule.next.live");
  const { item } = hero;
  const time = formatClubTime(item.class_time);
  let when: string;
  if (item.class_date === today) {
    const minutes = Math.max(0, Math.ceil((Date.parse(item.starts_at) - nowMs) / MINUTE_MS));
    when = minutes <= SOON_MINUTES ? t("schedule.next.inMinutes", { count: minutes }) : t("schedule.next.todayAt", { time });
  } else if (item.class_date === addDays(today, 1)) {
    when = t("schedule.next.tomorrowAt", { time });
  } else {
    when = t("schedule.next.dayAt", { day: formatWeekdayShortDay(item.class_date), time });
  }
  return t("schedule.next.titleWhen", { when });
}
