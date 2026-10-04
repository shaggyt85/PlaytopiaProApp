import { dotsByDate, MAX_DAY_DOTS } from "@/features/schedule/utils/dotsByDate";
import { darkTheme } from "@/shared/config/theme";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const palette = darkTheme.clubColors;
const at = (id: number, class_time: string, class_date = "2026-10-05") => scheduleClass({ id, class_time, class_date });

describe("dotsByDate", () => {
  it("un punto por clase, con su color en el día y en su orden", () => {
    const byDate = new Map([["2026-10-05", [at(2, "18:00:00"), at(1, "09:00:00")]]]);

    expect(dotsByDate(byDate, palette).get("2026-10-05")).toEqual([palette[0].color, palette[1].color]);
  });

  it("como mucho tres", () => {
    const byDate = new Map([
      ["2026-10-05", [at(1, "09:00:00"), at(2, "10:00:00"), at(3, "11:00:00"), at(4, "12:00:00")]],
    ]);

    expect(dotsByDate(byDate, palette).get("2026-10-05")).toHaveLength(MAX_DAY_DOTS);
  });

  it("cada día con los suyos, empezando por el primer color", () => {
    const byDate = new Map([
      ["2026-10-05", [at(1, "09:00:00")]],
      ["2026-10-06", [at(2, "10:00:00", "2026-10-06")]],
    ]);

    const dots = dotsByDate(byDate, palette);
    expect(dots.get("2026-10-06")).toEqual([palette[0].color]);
    expect(dots.get("2026-10-07")).toBeUndefined();
  });
});
