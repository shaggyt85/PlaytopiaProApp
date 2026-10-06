import { t } from "@/shared/config/i18n";
import { courtTimeLabel, courtTimeProgressLabel } from "@/shared/utils/courtTime";

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

describe("courtTimeProgressLabel", () => {
  it("lo hecho de lo planificado, los dos exactos", () => {
    expect(courtTimeProgressLabel(540, 720, t)).toBe("9:00 / 12:00 h");
    expect(courtTimeProgressLabel(45, 90, t)).toBe("0:45 / 1:30 h");
  });
});
