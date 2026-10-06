import { dayRangesLabel } from "@/features/profile/utils/dayRangesLabel";
import { t } from "@/shared/config/i18n";

describe("dayRangesLabel", () => {
  it("un día con su tramo", () => {
    expect(dayRangesLabel("1", [16, 17, 18], t)).toBe("Lun 16:00–19:00");
  });

  it("un turno partido: sus tramos unidos con «y»", () => {
    expect(dayRangesLabel("3", [9, 10, 17, 18], t)).toBe("Mié 09:00–11:00 y 17:00–19:00");
  });

  it("hasta medianoche acaba a las 24:00", () => {
    expect(dayRangesLabel("0", [22, 23], t)).toBe("Dom 22:00–24:00");
  });
});
