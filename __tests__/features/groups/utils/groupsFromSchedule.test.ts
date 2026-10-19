import { groupsFromSchedule } from "@/features/groups/utils/groupsFromSchedule";
import { CLASS_TYPE } from "@/shared/schemas/schedule.schema";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const NOW = Date.parse("2026-10-05T10:00:00Z");

/** Una clase del grupo `group_id` el día `date` a las 18:00 de Madrid (16:00 UTC). */
const session = (id: number, group_id: number | null, date: string, extra = {}) =>
  scheduleClass({
    id,
    group_id,
    class_date: date,
    class_time: "18:00:00",
    attendance_opens_at: `${date}T16:00:00Z`,
    attendance_closes_at: `${date}T22:00:00Z`,
    ...extra,
  });

describe("groupsFromSchedule", () => {
  it("un grupo por grupo de Core, con su próxima clase y los días en que tiene clase", () => {
    const groups = groupsFromSchedule(
      [
        session(3, 11, "2026-10-12"), // lunes
        session(1, 11, "2026-10-05"), // lunes, hoy
        session(2, 11, "2026-10-07"), // miércoles
      ],
      NOW,
    );

    expect(groups).toHaveLength(1);
    expect(groups[0].next.id).toBe(1);
    expect(groups[0].weekdayDates).toEqual(["2026-10-05", "2026-10-07"]);
    expect(groups[0].upcoming).toBe(3);
  });

  it("las clases que ya empezaron no cuentan: un grupo sin ninguna por delante no sale", () => {
    const groups = groupsFromSchedule([session(1, 11, "2026-10-04"), session(2, 12, "2026-10-06")], NOW);

    expect(groups.map((g) => g.next.id)).toEqual([2]);
  });

  it("una clase de una sola sesión también es un grupo; una plaza de recuperación, no", () => {
    const groups = groupsFromSchedule(
      [session(1, 20, "2026-10-06"), session(90, 21, "2026-10-06", { class_type: CLASS_TYPE.RECOVERY })],
      NOW,
    );

    expect(groups.map((g) => g.next.id)).toEqual([1]);
  });

  it("los grupos son de cada escuela, y una clase antigua sin grupo es el suyo propio", () => {
    const groups = groupsFromSchedule(
      [
        session(1, 11, "2026-10-06", { db_id: 4 }),
        session(2, 11, "2026-10-07", { db_id: 5 }),
        session(3, null, "2026-10-08"),
        session(4, null, "2026-10-09"),
      ],
      NOW,
    );

    expect(groups).toHaveLength(4);
  });

  it("ordenados por su próxima clase, la más cercana antes", () => {
    const groups = groupsFromSchedule([session(1, 11, "2026-10-09"), session(2, 12, "2026-10-06")], NOW);

    expect(groups.map((g) => g.next.id)).toEqual([2, 1]);
  });
});
