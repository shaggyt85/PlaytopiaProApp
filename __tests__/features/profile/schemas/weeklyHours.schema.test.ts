import { LAST_HOUR, WeeklyHoursSchema } from "@/features/profile/schemas/weeklyHours.schema";

describe("WeeklyHoursSchema", () => {
  it("acepta una semana con algunos días, de la hora 0 a la última", () => {
    const week = { "0": [0, 1], "1": [16, 17, 18], "6": [LAST_HOUR] };

    expect(WeeklyHoursSchema.parse(week)).toEqual(week);
  });

  it("acepta la semana vacía: aún no dijo cuándo puede", () => {
    expect(WeeklyHoursSchema.parse({})).toEqual({});
  });

  it.each([
    ["un día que no existe", { "7": [9] }],
    ["un día escrito de otra forma", { "01": [9] }],
    ["una hora después de la última", { "1": [LAST_HOUR + 1] }],
    ["una hora negativa", { "1": [-1] }],
    ["una hora con minutos", { "1": [9.5] }],
  ])("rechaza %s, como Core", (_case, week) => {
    expect(() => WeeklyHoursSchema.parse(week)).toThrow();
  });
});
