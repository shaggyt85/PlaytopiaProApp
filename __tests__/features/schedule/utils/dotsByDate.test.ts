import { dotsByDate, MAX_DAY_DOTS } from "@/features/schedule/utils/dotsByDate";
import type { ScheduleClass } from "@/features/schedule/schemas/schedule.schema";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const at = (id: number, club_id: number, class_date = "2026-10-05") =>
  scheduleClass({ id, db_id: 4, club_id, class_date });
const colorOf = (c: ScheduleClass) => `club-${c.club_id}`;

describe("dotsByDate", () => {
  it("un punto por club distinto, en el orden de sus clases", () => {
    const byDate = new Map([["2026-10-05", [at(1, 7), at(2, 8), at(3, 7)]]]);

    expect(dotsByDate(byDate, colorOf).get("2026-10-05")).toEqual(["club-7", "club-8"]);
  });

  it("como mucho tres", () => {
    const byDate = new Map([["2026-10-05", [at(1, 1), at(2, 2), at(3, 3), at(4, 4)]]]);

    expect(dotsByDate(byDate, colorOf).get("2026-10-05")).toHaveLength(MAX_DAY_DOTS);
  });

  it("la misma sucursal en otra escuela es otro club", () => {
    const otherSchool = scheduleClass({ id: 2, db_id: 5, club_id: 7, class_date: "2026-10-05" });
    const byDate = new Map([["2026-10-05", [at(1, 7), otherSchool]]]);

    expect(dotsByDate(byDate, colorOf).get("2026-10-05")).toHaveLength(2);
  });

  it("cada día con los suyos", () => {
    const byDate = new Map([
      ["2026-10-05", [at(1, 7)]],
      ["2026-10-06", [at(2, 8, "2026-10-06")]],
    ]);

    const dots = dotsByDate(byDate, colorOf);
    expect(dots.get("2026-10-06")).toEqual(["club-8"]);
    expect(dots.get("2026-10-07")).toBeUndefined();
  });
});
