import { classA11yLabel } from "@/features/schedule/utils/classA11yLabel";
import { t } from "@/shared/config/i18n";

import { scheduleClass } from "../../../helpers/scheduleFactories";

const cantera = scheduleClass();

describe("classA11yLabel", () => {
  it("lo dice todo de una vez, con su estado", () => {
    expect(classA11yLabel(cantera, "Sede Centro", "next", t)).toBe(
      "Cantera Tarde, 16:00, 75 minutos, Pista 1, Sede Centro, 3 de 4 plazas, próxima clase",
    );
    expect(classA11yLabel(cantera, "Sede Centro", "live", t)).toMatch(/, en curso$/);
    expect(classA11yLabel(cantera, "Sede Centro", "past", t)).toMatch(/, ya terminó$/);
  });

  it("no dice lo que falta: sin pista, sede sin nombre ni estado si aún no toca", () => {
    expect(classA11yLabel(scheduleClass({ track_name: "" }), "", "upcoming", t)).toBe(
      "Cantera Tarde, 16:00, 75 minutos, 3 de 4 plazas",
    );
  });
});
