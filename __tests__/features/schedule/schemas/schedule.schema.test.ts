import { ScheduleResponseSchema } from "@/features/schedule/schemas/schedule.schema";

import { nextClass, scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

describe("ScheduleResponseSchema", () => {
  it("acepta la agenda tal como la manda Core", () => {
    const body = scheduleResponse();
    expect(ScheduleResponseSchema.parse(body)).toEqual(body);
  });

  it("sin próxima clase, next_class llega a null", () => {
    expect(ScheduleResponseSchema.parse(scheduleResponse({ next_class: null })).next_class).toBeNull();
  });

  it("una clase suelta antigua llega sin grupo", () => {
    const loose = scheduleClass({ group_id: null, number_of_classes: null });
    expect(ScheduleResponseSchema.parse(scheduleResponse({ classes: [loose] })).classes[0]).toEqual(loose);
  });

  it("una clase sin alumnos no cumple el contrato", () => {
    const { students: _students, ...withoutStudents } = scheduleClass();
    expect(ScheduleResponseSchema.safeParse({ classes: [withoutStudents], next_class: null }).success).toBe(
      false,
    );
  });

  it("la próxima clase necesita su instante de inicio", () => {
    const { starts_at: _startsAt, ...withoutStart } = nextClass();
    expect(ScheduleResponseSchema.safeParse({ classes: [], next_class: withoutStart }).success).toBe(false);
  });
});
