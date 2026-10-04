import { courtTimeLabel, todayStats } from "@/features/schedule/utils/todayStats";
import { t } from "@/shared/config/i18n";

const lesson = (class_time: string, duration_minutes: number, current_participants = 0) => ({
  class_time,
  duration_minutes,
  current_participants,
});

describe("todayStats", () => {
  it("un día sin clases: todo a cero", () => {
    expect(todayStats([])).toEqual({ classes: 0, students: 0, minutesOnCourt: 0 });
  });

  it("cuenta las clases y suma las plazas ocupadas, aunque un alumno esté en dos", () => {
    const stats = todayStats([lesson("09:00:00", 60, 3), lesson("11:00:00", 60, 4)]);

    expect(stats.classes).toBe(2);
    expect(stats.students).toBe(7);
  });

  it("clases separadas: suma sus duraciones", () => {
    expect(todayStats([lesson("09:00:00", 60), lesson("11:00:00", 90)]).minutesOnCourt).toBe(150);
  });

  it("dos clases a la misma hora (dos pistas) cuentan una sola vez", () => {
    expect(todayStats([lesson("18:00:00", 60), lesson("18:00:00", 60)]).minutesOnCourt).toBe(60);
  });

  it("clases que se pisan en parte: el tiempo de la una a la otra, sin repetir", () => {
    // 18:00–19:00 y 18:30–19:30: de 18:00 a 19:30.
    expect(todayStats([lesson("18:30:00", 60), lesson("18:00:00", 60)]).minutesOnCourt).toBe(90);
  });

  it("una clase dentro de otra no añade nada", () => {
    expect(todayStats([lesson("10:00:00", 120), lesson("10:30:00", 30)]).minutesOnCourt).toBe(120);
  });

  it("una seguida de otra: se suman, sin hueco ni solape", () => {
    expect(todayStats([lesson("10:00:00", 60), lesson("11:00:00", 60)]).minutesOnCourt).toBe(120);
  });

  it("una clase que pasa de medianoche cuenta hasta las 24:00 (lo de después es de mañana)", () => {
    expect(todayStats([lesson("23:30:00", 60)]).minutesOnCourt).toBe(30);
  });
});

describe("courtTimeLabel", () => {
  it.each([
    [350, "5:50 h"],
    [357, "5:57 h"],
    [305, "5:05 h"],
    [45, "0:45 h"],
    [360, "6:00 h"],
    [0, "0:00 h"],
  ])("%i minutos son «%s», exactos", (minutes, label) => {
    expect(courtTimeLabel(minutes, t)).toBe(label);
  });
});
