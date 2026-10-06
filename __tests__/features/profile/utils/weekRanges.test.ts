import { weekRanges } from "@/features/profile/utils/weekRanges";

describe("weekRanges", () => {
  it("las horas seguidas son un tramo", () => {
    expect(weekRanges([16, 17, 18])).toEqual([{ start: 16, end: 19 }]);
  });

  it("un hueco parte el día en dos tramos (turno partido)", () => {
    expect(weekRanges([9, 10, 17])).toEqual([
      { start: 9, end: 11 },
      { start: 17, end: 18 },
    ]);
  });

  it("desordenadas o repetidas, igual", () => {
    expect(weekRanges([18, 16, 17, 16])).toEqual([{ start: 16, end: 19 }]);
  });

  it("la hora 23 acaba a las 24: el final del día", () => {
    expect(weekRanges([22, 23])).toEqual([{ start: 22, end: 24 }]);
  });

  it("sin horas, ningún tramo", () => {
    expect(weekRanges([])).toEqual([]);
  });
});
