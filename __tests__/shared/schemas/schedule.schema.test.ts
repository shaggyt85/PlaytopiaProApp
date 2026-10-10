import { AttendanceMarkSchema, ScheduleResponseSchema } from "@/shared/schemas/schedule.schema";

import {
  attendanceMark,
  classStudent,
  nextClass,
  scheduleClass,
  scheduleResponse,
} from "../../helpers/scheduleFactories";

/** La agenda con una clase con estos alumnos, validada. */
const parseStudents = (students: unknown[]) =>
  ScheduleResponseSchema.safeParse(scheduleResponse({ classes: [scheduleClass({ students: students as never })] }));

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

  it("una clase sin nivel ni pista llega con los dos a null", () => {
    const bare = scheduleClass({ level_range: null, track_name: null });
    expect(ScheduleResponseSchema.parse(scheduleResponse({ classes: [bare] })).classes[0]).toEqual(bare);
  });

  it("la privada llega como sí/no, y como el 0/1 del Core anterior", () => {
    const classes = [scheduleClass({ is_private: true }), scheduleClass({ is_private: 0 })];
    const parsed = ScheduleResponseSchema.parse(scheduleResponse({ classes }));
    expect(parsed.classes.map((c) => c.is_private)).toEqual([true, 0]);
  });

  it("una clase sin alumnos no cumple el contrato", () => {
    const { students: _students, ...withoutStudents } = scheduleClass();
    expect(ScheduleResponseSchema.safeParse({ classes: [withoutStudents], next_class: null }).success).toBe(
      false,
    );
  });

  it.each(["class_id", "student_id", "level", "attendance", "is_recovery"] as const)(
    "cada alumno trae su %s",
    (field) => {
      const { [field]: _dropped, ...without } = classStudent();
      expect(parseStudents([without]).success).toBe(false);
    },
  );

  it("sin matrícula en la sede llega sin nivel, y sin marca, sin asistencia", () => {
    const parsed = parseStudents([classStudent({ level: null, attendance: null })]);

    expect(parsed.success && parsed.data.classes[0].students[0]).toMatchObject({ level: null, attendance: null });
  });

  it("la asistencia solo es presente o ausente", () => {
    expect(parseStudents([classStudent({ attendance: "absent" })]).success).toBe(true);
    expect(parseStudents([{ ...classStudent(), attendance: "late" }]).success).toBe(false);
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
              classStudent({ student_id: 1, name: "Lucía", last_name: "Romero" }),
              classStudent({ student_id: 2, name: "Álvaro", last_name: "Zamora", is_recovery: true }),
              classStudent({ student_id: 3, name: "lucía", last_name: "Blanco" }),
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

describe("AttendanceMarkSchema", () => {
  it("acepta la marca guardada tal como la devuelve Core", () => {
    const body = attendanceMark({ status: "absent" });
    expect(AttendanceMarkSchema.parse(body)).toEqual(body);
  });

  it("sin quién la marcó no cumple el contrato", () => {
    const { marked_by: _by, ...withoutAuthor } = attendanceMark();
    expect(AttendanceMarkSchema.safeParse(withoutAuthor).success).toBe(false);
  });
});
