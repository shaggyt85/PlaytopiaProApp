import { daysWithHours } from "@/features/profile/utils/daysWithHours";

describe("daysWithHours", () => {
  it("los días con alguna hora, de lunes a domingo", () => {
    expect(daysWithHours({ "0": [10], "3": [9], "1": [18] })).toEqual(["1", "3", "0"]);
  });

  it("un día sin horas no cuenta", () => {
    expect(daysWithHours({ "1": [], "2": [7] })).toEqual(["2"]);
    expect(daysWithHours({})).toEqual([]);
  });
});
