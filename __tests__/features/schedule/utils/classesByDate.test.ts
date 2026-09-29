import { classesByDate } from "@/features/schedule/utils/classesByDate";

import { scheduleClass } from "../../../helpers/scheduleFactories";

describe("classesByDate", () => {
  it("agrupa por día, en el orden en que llegan", () => {
    const monday = scheduleClass({ id: 1, class_date: "2026-10-05", class_time: "09:00:00" });
    const mondayLater = scheduleClass({ id: 2, class_date: "2026-10-05", class_time: "18:00:00" });
    const tuesday = scheduleClass({ id: 3, class_date: "2026-10-06" });

    const byDate = classesByDate([monday, mondayLater, tuesday]);

    expect(byDate.get("2026-10-05")).toEqual([monday, mondayLater]);
    expect(byDate.get("2026-10-06")).toEqual([tuesday]);
  });

  it("un día sin clases no está", () => {
    expect(classesByDate([]).get("2026-10-05")).toBeUndefined();
  });
});
