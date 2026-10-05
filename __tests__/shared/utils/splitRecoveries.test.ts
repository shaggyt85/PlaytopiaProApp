import { splitRecoveries } from "@/shared/utils/splitRecoveries";

import { classStudent } from "../../helpers/scheduleFactories";

describe("splitRecoveries", () => {
  it("separa a los del grupo de los que vienen a recuperar, cada parte en su orden", () => {
    const lucia = classStudent({ student_id: 1 });
    const marta = classStudent({ student_id: 2, is_recovery: true });
    const diego = classStudent({ student_id: 3 });

    expect(splitRecoveries([lucia, marta, diego])).toEqual({ members: [lucia, diego], recoveries: [marta] });
  });

  it("sin alumnos, las dos partes vacías", () => {
    expect(splitRecoveries([])).toEqual({ members: [], recoveries: [] });
  });
});
