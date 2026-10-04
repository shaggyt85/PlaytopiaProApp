import { withAttendance } from "@/features/schedule/utils/withAttendance";

import { classStudent, nextClass, scheduleClass, scheduleResponse } from "../../../helpers/scheduleFactories";

const lucia = classStudent();
const diego = classStudent({ student_id: 54, name: "Diego", last_name: "Pérez" });
// Recupera en la clase 31 desde su plaza, la 90.
const marta = classStudent({ class_id: 90, student_id: 77, name: "Marta", is_recovery: true });

const cantera = scheduleClass({ db_id: 4, id: 31, students: [diego, lucia, marta] });
// La misma clase en otra escuela: el id solo es único dentro de su escuela.
const otherSchool = scheduleClass({ db_id: 5, id: 31, students: [lucia] });

describe("withAttendance", () => {
  it("marca al alumno de la clase de esa escuela y deja a los demás como estaban", () => {
    const data = scheduleResponse({ classes: [cantera, otherSchool], next_class: null });

    const marked = withAttendance(data, { dbId: 4, classId: 31, studentId: 55 }, "present");

    expect(marked.classes[0].students.map((s) => s.attendance)).toEqual([null, "present", null]);
    expect(marked.classes[1]).toBe(otherSchool);
    expect(marked.classes[0].students[0]).toBe(diego);
  });

  it("quien recupera se marca por su plaza, en la tarjeta de su clase", () => {
    const data = scheduleResponse({ classes: [cantera], next_class: null });

    const marked = withAttendance(data, { dbId: 4, classId: 90, studentId: 77 }, "absent");

    expect(marked.classes[0].students[2].attendance).toBe("absent");
  });

  it("también en la próxima clase, que va aparte", () => {
    const data = scheduleResponse({ classes: [], next_class: nextClass({ db_id: 4, id: 31, students: [lucia] }) });

    const marked = withAttendance(data, { dbId: 4, classId: 31, studentId: 55 }, "present");

    expect(marked.next_class?.students[0].attendance).toBe("present");
  });

  it("si el alumno no está, nada cambia", () => {
    const data = scheduleResponse({ classes: [cantera], next_class: null });

    expect(withAttendance(data, { dbId: 4, classId: 31, studentId: 999 }, "present").classes[0]).toBe(cantera);
  });
});
