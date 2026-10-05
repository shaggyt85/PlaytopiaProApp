import { classMinutes, classStatus, statusOnDay } from "@/features/schedule/utils/classTiming";
import { wallAsUtcMs } from "@/shared/utils/clubClock";

import { scheduleClass } from "../../../helpers/scheduleFactories";

// Cantera Tarde: el 5 de octubre de 16:00 a 17:15.
const cantera = scheduleClass({ id: 31, class_date: "2026-10-05", class_time: "16:00:00", duration_minutes: 75 });
const at = (time: string) => wallAsUtcMs("2026-10-05", time);

describe("classMinutes", () => {
  it("son los minutos desde las 00:00 de su día", () => {
    expect(classMinutes(cantera)).toEqual({ start: 960, end: 1035 });
  });

  it("una clase que pasa de medianoche se corta a las 24:00", () => {
    expect(classMinutes({ class_time: "23:30:00", duration_minutes: 60 })).toEqual({ start: 1410, end: 1440 });
  });
});

describe("classStatus", () => {
  it("terminada es pasada, aunque sea justo al acabar", () => {
    expect(classStatus(cantera, at("17:15:00"), undefined)).toBe("past");
    expect(classStatus(cantera, at("20:00:00"), undefined)).toBe("past");
  });

  it("empezada y sin terminar está en curso", () => {
    expect(classStatus(cantera, at("16:00:00"), undefined)).toBe("live");
    expect(classStatus(cantera, at("17:14:00"), 31)).toBe("live");
  });

  it("por delante, es la próxima solo si es la que dice Core", () => {
    expect(classStatus(cantera, at("15:21:00"), 31)).toBe("next");
    expect(classStatus(cantera, at("15:21:00"), 99)).toBe("upcoming");
    expect(classStatus(cantera, at("15:21:00"), undefined)).toBe("upcoming");
  });
});

describe("statusOnDay", () => {
  it("un día que ya pasó, pasada; uno por venir, por venir", () => {
    expect(statusOnDay(cantera, "past", undefined)).toBe("past");
    expect(statusOnDay(cantera, "future", undefined)).toBe("upcoming");
  });

  it("hoy, según la hora: en curso, pasada o por venir", () => {
    expect(statusOnDay(cantera, "today", at("16:30:00"))).toBe("live");
    expect(statusOnDay(cantera, "today", at("18:00:00"))).toBe("past");
    expect(statusOnDay(cantera, "today", at("10:00:00"))).toBe("upcoming");
  });

  it("hoy, la próxima si es la que dice Core; otro día, nunca", () => {
    expect(statusOnDay(cantera, "today", at("10:00:00"), cantera.id)).toBe("next");
    expect(statusOnDay(cantera, "future", undefined, cantera.id)).toBe("upcoming");
  });
});
