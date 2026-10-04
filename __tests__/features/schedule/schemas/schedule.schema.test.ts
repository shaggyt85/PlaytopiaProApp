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

  it("cada alumno dice si viene a recuperar", () => {
    const { is_recovery: _recovery, ...withoutRecovery } = scheduleClass().students[0];
    const parsed = ScheduleResponseSchema.safeParse(
      scheduleResponse({ classes: [scheduleClass({ students: [withoutRecovery as never] })] }),
    );

    expect(parsed.success).toBe(false);
  });

  it("la próxima clase necesita su instante de inicio", () => {
    const { starts_at: _startsAt, ...withoutStart } = nextClass();
    expect(ScheduleResponseSchema.safeParse({ classes: [], next_class: withoutStart }).success).toBe(false);
  });

  it("ordena a los alumnos por nombre y apellido, como el idioma: el mismo orden y color en todas partes", () => {
    const parsed = ScheduleResponseSchema.parse(
      scheduleResponse({
        classes: [
          scheduleClass({
            students: [
              { name: "Lucía", last_name: "Romero", is_recovery: false },
              { name: "Álvaro", last_name: "Zamora", is_recovery: true },
              { name: "lucía", last_name: "Blanco", is_recovery: false },
            ],
          }),
        ],
      }),
    );

    expect(parsed.classes[0].students.map((s) => `${s.name} ${s.last_name}`)).toEqual([
      "Álvaro Zamora",
      "lucía Blanco",
      "Lucía Romero",
    ]);
  });
});
